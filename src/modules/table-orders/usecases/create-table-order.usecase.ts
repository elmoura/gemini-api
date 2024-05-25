import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateTableOrderInput } from './types/create-table-order.input';
import {
  TableOrderPayment,
  TableOrderPricing,
  TableOrder,
} from '../entities/table-order';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { TableOrderItem } from '../entities/table-order-item';
import { Product } from '@modules/products/entities/product';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';
import { TableDataSource } from '../../table/datasources/table.datasource';
import { TableNotFoundException } from '../../table/errors/table-not-found';
import { CurrentUserData } from '@shared/decorators/current-user';
import { formatOrderItem } from '../utils/format-order-item';

@Injectable()
export class CreateTableOrderUseCase
  implements IBaseUseCase<CreateTableOrderInput & CurrentUserData, TableOrder>
{
  constructor(
    private productDataSource: ProductDataSource,
    private tableDataSource: TableDataSource,
    private tableOrderDataSource: TableOrderDataSource,
  ) {}

  /**
   * @todo Adicionar validações mais especificas: descontos
   * Adicionar adicionais do pedido
   */
  async execute(
    input: CreateTableOrderInput & CurrentUserData,
  ): Promise<TableOrder> {
    if (!input.organizationId || !input.locationId)
      throw new UnauthorizedException();

    const table = await this.tableDataSource.findByTableAndOrgId(
      input.tableId,
      input.organizationId,
    );

    if (!table) throw new TableNotFoundException();

    const productIds = input.items.map((item) => item.productId);
    const products = await this.productDataSource.findManyByIds(productIds);

    const productsMapById: Record<string, Product> = {};
    products.forEach((product) => {
      productsMapById[product._id] = product;
    });

    // possiblitar q exista mais de um item do mesmo id
    // outro registro do mesmo produto diferenciado por: observação, adicionais
    const items = input.items.map((item) =>
      formatOrderItem(
        {
          quantity: item.quantity,
          observation: item.observation,
        },
        productsMapById[item.productId],
      ),
    );
    const payment = this.formatPaymentInfo(items);
    const pricing = this.formatPricingInfo(items);

    return this.tableOrderDataSource.createOne({
      organizationId: input.organizationId,
      locationId: input.locationId,
      table: {
        _id: table._id,
        identifier: table.identifier,
      },
      status: TableOrderStatuses.IN_ATTENDANCE,
      items,
      pricing,
      payment,
    });
  }

  private formatPaymentInfo(items: TableOrderItem[]): TableOrderPayment {
    const total = items.reduce((accum, item) => accum + item.total, 0);

    return {
      total,
      paidAmount: 0,
      instalments: 0,
      paymentStatus: TableOrderPaymentStatuses.PENDING,
    };
  }

  private formatPricingInfo(items: TableOrderItem[]): TableOrderPricing {
    const total = items.reduce((accum, item) => accum + item.total, 0);
    const discount = items.reduce((accum, item) => accum + item.discount, 0);

    return {
      total,
      discount,
      fees: 0,
    };
  }
}
