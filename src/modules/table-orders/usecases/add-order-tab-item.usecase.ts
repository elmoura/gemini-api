import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrderTab } from '../entities/order-tab';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ComplementGroupDataSource } from '@modules/complement-groups/datasources/complement-group.datasource';
import { ComplementDataSource } from '@modules/complement-groups/datasources/complement.datasource';
import { AddOrderTabItemInput } from './types/add-order-tab-item.input';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { InvalidProductId } from '../errors/invalid-product-id';
import { syncTableOrderFromTabs } from './helpers/sync-table-order-from-tabs';
import { calculateOrderTabPrice } from '../utils/calculate-order-tab-price';
import { deriveOrderTabPaymentStatus } from '../utils/derive-order-tab-payment-status';
import { buildOrderTabItem } from '../utils/build-order-tab-item';
import { areItemComplementsEqual } from '../utils/complements-fingerprint';
import { calculateItemLineTotal } from '../utils/calculate-item-line-total';
import { PrintJobService } from '@modules/print-jobs/services/print-job.service';
import { computeBatchAffectedItems } from '@modules/print-jobs/utils/compute-batch-affected-items';

@Injectable()
export class AddOrderTabItemUseCase
  implements IBaseUseCase<AddOrderTabItemInput, OrderTab>
{
  constructor(
    private orderTabDataSource: OrderTabDataSource,
    private tableOrderDataSource: TableOrderDataSource,
    private productDataSource: ProductDataSource,
    private complementGroupDataSource: ComplementGroupDataSource,
    private complementDataSource: ComplementDataSource,
    @Inject(forwardRef(() => PrintJobService))
    private printJobService: PrintJobService,
  ) {}

  async execute(input: AddOrderTabItemInput): Promise<OrderTab> {
    const { orderTabId, organizationId, locationId } = input;

    const tab = await this.orderTabDataSource.findById(
      orderTabId,
      organizationId,
    );

    if (!tab) throw new OrderTabNotFoundException();

    if (tab.status !== OrderTabStatuses.IN_ATTENDANCE) {
      throw new OrderTabNotUpdated(
        'A comanda deve estar "em atendimento" para ser alterada',
      );
    }

    const itemsBefore = [...tab.items];
    const batchId = randomUUID();

    await Promise.all(
      input.items.map(async (newItem) => {
        const equalOrderItem = tab.items.find(
          (orderItem) =>
            newItem.productId === orderItem.productId &&
            (newItem.observation ?? '').toLowerCase().trim() ===
              (orderItem.observation ?? '').toLowerCase().trim() &&
            areItemComplementsEqual(
              orderItem.complements,
              newItem.complements ?? [],
            ),
        );

        if (equalOrderItem) {
          const totalQuantity = equalOrderItem.quantity + newItem.quantity;

          return this.orderTabDataSource.updateItem(
            orderTabId,
            equalOrderItem._id.toString(),
            {
              total: calculateItemLineTotal({
                ...equalOrderItem,
                quantity: totalQuantity,
              }),
              quantity: totalQuantity,
            },
          );
        }

        const product = await this.productDataSource.findById(
          newItem.productId,
        );

        if (!product || product.organizationId !== organizationId) {
          throw new InvalidProductId(newItem.productId);
        }

        const formatedItem = await buildOrderTabItem({
          itemInput: newItem,
          product,
          organizationId,
          locationId: locationId ?? tab.locationId,
          complementGroupDataSource: this.complementGroupDataSource,
          complementDataSource: this.complementDataSource,
        });

        return this.orderTabDataSource.pushItem(orderTabId, formatedItem);
      }),
    );

    const tabWithNewItems = await this.orderTabDataSource.findById(
      orderTabId,
      organizationId,
    );

    const pricing = calculateOrderTabPrice(tabWithNewItems, {
      payServiceTax: false,
    });

    await this.orderTabDataSource.updateOne(orderTabId, organizationId, {
      pricing: {
        discount: pricing.discount,
        total: pricing.total,
        fees: pricing.fees,
      },
      paymentStatus: deriveOrderTabPaymentStatus(
        tabWithNewItems.payments,
        pricing.total,
      ),
    });

    await syncTableOrderFromTabs(
      tab.tableOrderId,
      organizationId,
      this.orderTabDataSource,
      this.tableOrderDataSource,
    );

    const finalTab = await this.orderTabDataSource.findById(
      orderTabId,
      organizationId,
    );

    const affectedItems = computeBatchAffectedItems(
      itemsBefore,
      finalTab.items,
      input.items,
    );

    this.printJobService.enqueueBatchAddedJob({
      orderTab: finalTab,
      batchId,
      affectedItems,
      source: input.source,
    });

    return finalTab;
  }
}
