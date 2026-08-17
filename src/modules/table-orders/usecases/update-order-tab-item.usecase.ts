import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrderTab } from '../entities/order-tab';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ComplementGroupDataSource } from '@modules/complement-groups/datasources/complement-group.datasource';
import { ComplementDataSource } from '@modules/complement-groups/datasources/complement.datasource';
import { UpdateOrderTabItemInput } from './types/update-order-tab-item.input';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { syncTableOrderFromTabs } from './helpers/sync-table-order-from-tabs';
import { calculateOrderTabPrice } from '../utils/calculate-order-tab-price';
import { buildOrderTabItem } from '../utils/build-order-tab-item';
import { areItemComplementsEqual } from '../utils/complements-fingerprint';
import { PrintJobService } from '@modules/print-jobs/services/print-job.service';

@Injectable()
export class UpdateOrderTabItemUseCase
  implements IBaseUseCase<UpdateOrderTabItemInput, OrderTab>
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

  async execute(input: UpdateOrderTabItemInput): Promise<OrderTab> {
    const tab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    if (!tab) throw new OrderTabNotFoundException();

    if (tab.status !== OrderTabStatuses.IN_ATTENDANCE) {
      throw new OrderTabNotUpdated(
        'A comanda deve estar "em atendimento" para ser alterada',
      );
    }

    const existingItem = tab.items.find(
      (item) => item._id.toString() === input.itemId,
    );

    if (!existingItem) {
      throw new NotFoundException('Item da comanda não encontrado');
    }

    const product = await this.productDataSource.findById(
      existingItem.productId,
    );

    if (!product || product.organizationId !== input.organizationId) {
      throw new NotFoundException('Produto do item não encontrado');
    }

    const quantity = input.quantity ?? existingItem.quantity;
    const observation =
      input.observation !== undefined
        ? input.observation
        : existingItem.observation;
    const complementsInput =
      input.complements !== undefined
        ? input.complements
        : (existingItem.complements ?? []).map((complement) => ({
            complementId: complement.complementId,
            quantity: complement.quantity,
          }));

    const rebuiltItem = await buildOrderTabItem({
      itemInput: {
        productId: existingItem.productId,
        quantity,
        observation,
        complements: complementsInput,
      },
      product,
      organizationId: input.organizationId,
      locationId: input.locationId ?? tab.locationId,
      complementGroupDataSource: this.complementGroupDataSource,
      complementDataSource: this.complementDataSource,
    });

    const hasChanged =
      rebuiltItem.quantity !== existingItem.quantity ||
      (rebuiltItem.observation ?? '').trim().toLowerCase() !==
        (existingItem.observation ?? '').trim().toLowerCase() ||
      !areItemComplementsEqual(
        existingItem.complements,
        rebuiltItem.complements ?? [],
      );

    await this.orderTabDataSource.updateItem(input.orderTabId, input.itemId, {
      quantity: rebuiltItem.quantity,
      observation: rebuiltItem.observation,
      complements: rebuiltItem.complements,
      total: rebuiltItem.total,
      productName: rebuiltItem.productName,
      productPrice: rebuiltItem.productPrice,
      discount: rebuiltItem.discount,
    });

    const tabWithUpdatedItem = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    const pricing = calculateOrderTabPrice(tabWithUpdatedItem, {
      payServiceTax: false,
    });

    await this.orderTabDataSource.updateOne(
      input.orderTabId,
      input.organizationId,
      {
        pricing: {
          discount: pricing.discount,
          total: pricing.total,
          fees: pricing.fees,
        },
        payment: {
          ...tabWithUpdatedItem.payment,
          total: pricing.total,
        },
      },
    );

    await syncTableOrderFromTabs(
      tab.tableOrderId,
      input.organizationId,
      this.orderTabDataSource,
      this.tableOrderDataSource,
    );

    const finalTab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    if (hasChanged) {
      this.printJobService.enqueueItemUpdatedJob({
        orderTab: finalTab,
        itemId: input.itemId,
        itemBefore: {
          quantity: existingItem.quantity,
          productName: existingItem.productName,
          observation: existingItem.observation,
          complements: existingItem.complements,
        },
        itemAfter: {
          quantity: rebuiltItem.quantity,
          productName: rebuiltItem.productName,
          observation: rebuiltItem.observation,
          complements: rebuiltItem.complements,
        },
        changeId: randomUUID(),
        source: input.source,
      });
    }

    return finalTab;
  }
}
