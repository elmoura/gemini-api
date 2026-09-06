import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CurrentUserData } from '@shared/decorators/current-user';
import { CreateOrderTabInput } from './types/create-order-tab.input';
import { OrderTab } from '../entities/order-tab';
import { TableOrderPricing } from '../entities/table-order';
import { TableOrderItem } from '../entities/table-order-item';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ComplementGroupDataSource } from '@modules/complement-groups/datasources/complement-group.datasource';
import { ComplementDataSource } from '@modules/complement-groups/datasources/complement.datasource';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';
import { TableOrderNotUpdated } from '../errors/table-order-not-updated';
import { TableOrderStatuses } from '../enums/table-order-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { Product } from '@modules/products/entities/product';
import { syncTableOrderFromTabs } from './helpers/sync-table-order-from-tabs';
import { LocationShiftDataSource } from '@modules/location-shifts/datasources/location-shift.datasource';
import { NoOpenLocationShiftException } from '@modules/location-shifts/errors/no-open-location-shift';
import { buildOrderTabItem } from '../utils/build-order-tab-item';
import { InvalidProductId } from '../errors/invalid-product-id';
import { PrintJobService } from '@modules/print-jobs/services/print-job.service';
import { computeBatchAffectedItems } from '@modules/print-jobs/utils/compute-batch-affected-items';

@Injectable()
export class CreateOrderTabUseCase
  implements IBaseUseCase<CreateOrderTabInput & CurrentUserData, OrderTab>
{
  constructor(
    private tableOrderDataSource: TableOrderDataSource,
    private orderTabDataSource: OrderTabDataSource,
    private productDataSource: ProductDataSource,
    private complementGroupDataSource: ComplementGroupDataSource,
    private complementDataSource: ComplementDataSource,
    private locationShiftDataSource: LocationShiftDataSource,
    @Inject(forwardRef(() => PrintJobService))
    private printJobService: PrintJobService,
  ) {}

  async execute(
    input: CreateOrderTabInput & CurrentUserData,
  ): Promise<OrderTab> {
    if (!input.organizationId || !input.locationId)
      throw new UnauthorizedException();

    const openShift = await this.locationShiftDataSource.findOpenByLocation(
      input.organizationId,
      input.locationId,
    );

    if (!openShift) throw new NoOpenLocationShiftException();

    const tableOrder = await this.tableOrderDataSource.findById(
      input.tableOrderId,
      input.organizationId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    if (tableOrder.status !== TableOrderStatuses.IN_ATTENDANCE) {
      throw new TableOrderNotUpdated(
        'O pedido deve estar "em atendimento" para criar comandas',
      );
    }

    const existingTabs = await this.orderTabDataSource.findByTableOrderId(
      input.tableOrderId,
      input.organizationId,
    );
    const sequence = existingTabs.length + 1;

    let items: TableOrderItem[] = [];
    let pricing: TableOrderPricing = { total: 0, discount: 0, fees: 0 };

    if (input.items.length > 0) {
      const productIds = input.items.map((item) => item.productId);
      const products = await this.productDataSource.findManyByIds(productIds);

      const productsMapById: Record<string, Product> = {};
      products.forEach((product) => {
        productsMapById[product._id] = product;
      });

      items = await Promise.all(
        input.items.map(async (item) => {
          const product = productsMapById[item.productId];

          if (!product || product.organizationId !== input.organizationId) {
            throw new InvalidProductId(item.productId);
          }

          return buildOrderTabItem({
            itemInput: item,
            product,
            organizationId: input.organizationId,
            locationId: input.locationId,
            complementGroupDataSource: this.complementGroupDataSource,
            complementDataSource: this.complementDataSource,
          });
        }),
      );
      pricing = this.formatPricingInfo(items);
    }

    const orderTab = await this.orderTabDataSource.createOne({
      tableOrderId: input.tableOrderId,
      organizationId: input.organizationId,
      locationId: input.locationId,
      sequence,
      status: OrderTabStatuses.IN_ATTENDANCE,
      items,
      pricing,
      payments: [],
      paymentStatus: TableOrderPaymentStatuses.PENDING,
    });

    await this.tableOrderDataSource.pushTabId(
      input.tableOrderId,
      input.organizationId,
      orderTab._id,
    );

    await syncTableOrderFromTabs(
      input.tableOrderId,
      input.organizationId,
      this.orderTabDataSource,
      this.tableOrderDataSource,
    );

    await this.locationShiftDataSource.incrementOrderTabsQuantity(
      openShift._id,
      input.organizationId,
    );

    const finalTab = await this.orderTabDataSource.findById(
      orderTab._id,
      input.organizationId,
    );

    if (input.items.length > 0) {
      const batchId = randomUUID();
      const affectedItems = computeBatchAffectedItems(
        [],
        finalTab.items,
        input.items,
      );

      this.printJobService.enqueueBatchAddedJob({
        orderTab: finalTab,
        batchId,
        affectedItems,
        source: input.source,
      });
    }

    return finalTab;
  }

  private formatPricingInfo(items: TableOrderItem[]): TableOrderPricing {
    const total = items.reduce((accum, item) => accum + item.total, 0);
    const discount = items.reduce(
      (accum, item) => accum + item.discount * item.quantity,
      0,
    );

    return {
      total,
      discount,
      fees: 0,
    };
  }
}
