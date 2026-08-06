import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { RemoveOrderTabItemInput } from './types/remove-order-tab-item.input';
import { OrderTab } from '../entities/order-tab';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { InvalidItemId } from '../errors/invalid-item-id';
import { calculateOrderTabPrice } from '../utils/calculate-order-tab-price';
import { syncTableOrderFromTabs } from './helpers/sync-table-order-from-tabs';

@Injectable()
export class RemoveOrderTabItemUseCase
  implements IBaseUseCase<RemoveOrderTabItemInput, OrderTab>
{
  constructor(
    private orderTabDataSource: OrderTabDataSource,
    private tableOrderDataSource: TableOrderDataSource,
  ) {}

  async execute(input: RemoveOrderTabItemInput): Promise<OrderTab> {
    const { orderTabId, organizationId, itemId } = input;

    const orderTab = await this.orderTabDataSource.findById(
      orderTabId,
      organizationId,
    );

    if (!orderTab) throw new OrderTabNotFoundException();

    if (orderTab.status !== OrderTabStatuses.IN_ATTENDANCE) {
      throw new OrderTabNotUpdated(
        'A comanda deve estar "em atendimento" para ser alterada',
      );
    }

    let itemToRemoveIndex = -1;
    const orderItem = orderTab.items.find((item, index) => {
      const itemMatched = item._id.toString() === itemId;

      if (itemMatched) itemToRemoveIndex = index;

      return itemMatched;
    });

    if (itemToRemoveIndex < 0) throw new InvalidItemId();

    const updatedItems = [...orderTab.items];

    if (!input.quantity || input.quantity >= orderItem.quantity) {
      await this.orderTabDataSource.removeItem(orderTabId, itemId);
      updatedItems.splice(itemToRemoveIndex, 1);
    } else {
      const targetQuantity = orderItem.quantity - input.quantity;
      const targetPrice = orderItem.productPrice * targetQuantity;
      const updatedOrderItem = {
        ...orderItem,
        quantity: targetQuantity,
        total: targetPrice,
      };

      await this.orderTabDataSource.updateItem(
        orderTabId,
        itemId,
        updatedOrderItem,
      );

      updatedItems[itemToRemoveIndex] = updatedOrderItem;
    }

    const tabForPricing = { ...orderTab, items: updatedItems };
    const pricing = calculateOrderTabPrice(tabForPricing, {
      payServiceTax: false,
    });

    await this.orderTabDataSource.updateOne(orderTabId, organizationId, {
      payment: {
        ...orderTab.payment,
        total: pricing.total,
      },
      pricing: {
        discount: pricing.discount,
        fees: pricing.fees,
        total: pricing.total,
      },
    });

    await syncTableOrderFromTabs(
      orderTab.tableOrderId,
      organizationId,
      this.orderTabDataSource,
      this.tableOrderDataSource,
    );

    return this.orderTabDataSource.findById(orderTabId, organizationId);
  }
}
