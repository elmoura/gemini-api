import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import {
  CreateTableOrderInput,
  TableOrderItemInput,
} from './types/create-table-order.input';
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
import { TableDataSource } from '../datasources/table.datasource';
import { TableNotFoundException } from '../errors/table-not-found';
import { CurrentUserData } from '@shared/decorators/current-user';

interface IProductWithQuantity extends Product {
  quantity: number;
}

@Injectable()
export class CreateTableOrderUseCase
  implements IBaseUseCase<CreateTableOrderInput & CurrentUserData, TableOrder>
{
  constructor(
    private productDataSource: ProductDataSource,
    private tableDataSource: TableDataSource,
    private tableOrderDataSource: TableOrderDataSource,
  ) {}

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

    const productIds = [];
    const itemsMapById: Record<string, TableOrderItemInput> = {};

    input.items.forEach((item) => {
      productIds.push(item.productId);
      itemsMapById[item.productId] = item;
    });

    const products = await this.productDataSource.findManyByIds(productIds);

    const orderProductsWithQuantities = products.map((product) => ({
      ...product,
      quantity: itemsMapById[product._id].quantity,
    }));

    const items = this.formatOrderitems(orderProductsWithQuantities);
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

  private formatOrderitems(products: IProductWithQuantity[]): TableOrderItem[] {
    return products.map((product) => {
      const productPrice = product.isPromotionalPriceEnabled
        ? product.promotionalPrice
        : product.originalPrice;

      const discount = product.originalPrice - productPrice;

      // add createdAt updatedAt
      // https://stackoverflow.com/questions/64385442/add-timestamp-to-a-new-subdocument-or-subschema-in-mongoose
      return {
        productId: product._id,
        discount,
        productPrice,
        quantity: product.quantity,
        total: productPrice * product.quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
