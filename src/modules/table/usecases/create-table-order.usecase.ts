import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CurrentUserData } from '@shared/decorators/current-user';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { TableOrder } from '../entities/table-order';
import {
  CreateTableOrderInput,
  TableOrderItemInput,
} from './types/create-table-order.input';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { TableOrderStatuses } from '../enums/table-order-statuses';
import { TableDataSource } from '../datasources/table.datasource';
import { formatOrderItems } from '../helpers/format-order-items';
import { formatPricingInfo } from '../helpers/format-order-princing-info';
import { formatPaymentInfo } from '../helpers/format-order-payment-info';
import { TableNotFoundException } from '../errors/table-not-found';

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

    const items = formatOrderItems(orderProductsWithQuantities);

    const paidAmount = 0;
    const instalments = 0;
    const payment = formatPaymentInfo(items, paidAmount, instalments);

    const fees = 0;
    const pricing = formatPricingInfo(items, fees);

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
}
