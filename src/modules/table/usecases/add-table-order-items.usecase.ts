import { Injectable, ForbiddenException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CurrentUserData } from '@shared/decorators/current-user';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { OrganizationLocationDataSource } from '@modules/organizations/datasources/organization-location.datasource';
import { TableOrder } from '../entities/table-order';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { AddTableOrderItemsInput } from './types/add-table-order-items.input';
import { TableOrderStatuses } from '../enums/table-order-statuses';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';
import { TableOrderAlreadyClosedException } from '../errors/table-order-already-closed';
import { TableOrderItemInput } from './types/create-table-order.input';
import { formatOrderItems } from '../helpers/format-order-items';
import { formatPaymentInfo } from '../helpers/format-order-payment-info';
import { formatPricingInfo } from '../helpers/format-order-princing-info';
import { Product } from '@modules/products/entities/product';
import { TableOrderItem } from '../entities/table-order-item';

@Injectable()
export class AddTableOrderItemsUseCase
  implements
    IBaseUseCase<AddTableOrderItemsInput & CurrentUserData, TableOrder>
{
  constructor(
    private productDataSource: ProductDataSource,
    private tableOrderDataSource: TableOrderDataSource,
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute(
    input: AddTableOrderItemsInput & CurrentUserData,
  ): Promise<TableOrder> {
    const { organizationId, locationId, tableOrderId } = input;

    const locationExists =
      await this.organizationLocationDataSource.findByOrgAndLocationId(
        organizationId,
        locationId,
      );

    if (!locationExists) throw new ForbiddenException();

    const tableOrder = await this.tableOrderDataSource.findByLocationAndId(
      locationId,
      tableOrderId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    if (tableOrder.status !== TableOrderStatuses.IN_ATTENDANCE)
      throw new TableOrderAlreadyClosedException();

    const productIds = [];
    const itemsMapById: Record<string, TableOrderItemInput> = {};
    const previousOrderItemsMapById: Record<string, TableOrderItem> = {};

    input.items.forEach((item) => {
      productIds.push(item.productId);
      itemsMapById[item.productId] = item;
    });

    tableOrder.items.forEach((previousItem) => {
      previousOrderItemsMapById[previousItem.productId] = previousItem;
    });

    input.items.map((newItem) => {
      const alreadyOrderedItem = previousOrderItemsMapById[newItem.productId];

      if (alreadyOrderedItem) {
        const newItemWithTotalQuantities = {
          productId: newItem.productId,
          quantity: newItem.quantity + alreadyOrderedItem.quantity,
        };

        itemsMapById[newItem.productId] = newItemWithTotalQuantities;
        return newItemWithTotalQuantities;
      }

      return newItem;
    });

    const products = await this.productDataSource.findManyByIds(productIds);

    const isAnySentProductFromOutsideOrganization = this.validateProducts(
      products,
      organizationId,
    );

    if (isAnySentProductFromOutsideOrganization) throw new ForbiddenException();

    const newOrderProductsWithQuantities = products.map((product) => ({
      ...product,
      quantity: itemsMapById[product._id].quantity,
    }));

    const newItems = formatOrderItems(newOrderProductsWithQuantities);
    const allOrderItems = [...tableOrder.items, ...newItems];

    const paidAmount = 0;
    const instalments = 0;
    const payment = formatPaymentInfo(allOrderItems, paidAmount, instalments);

    const fees = 0;
    const pricing = formatPricingInfo(allOrderItems, fees);

    // Adicionando o mesmo item varias vezes com quantidades incrementadas
    await this.tableOrderDataSource.updateOne(tableOrderId, {
      pricing,
      payment,
      items: allOrderItems,
    });

    return this.tableOrderDataSource.findByLocationAndId(
      locationId,
      tableOrderId,
    );
  }

  validateProducts(products: Product[], organizationId: string): boolean {
    return products.some(
      (product) => product.organizationId !== organizationId,
    );
  }
}
