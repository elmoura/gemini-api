import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OrderTab } from '@modules/table-orders/entities/order-tab';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { TableOrderDataSource } from '@modules/table-orders/datasources/table-order.datasource';
import { TableOrderItemComplement } from '@modules/table-orders/entities/table-order-item';
import { PrintJobDataSource } from '../datasources/print-job.datasource';
import { LocationPrintConfigDataSource } from '../datasources/location-print-config.datasource';
import { PrintJobTrigger } from '../enums/print-job-trigger';
import { PrintJobStatus } from '../enums/print-job-status';
import { PrintClientType } from '../enums/print-client-type';
import { BatchAffectedItem } from '../utils/compute-batch-affected-items';
import { buildKitchenBatchPayload } from '../utils/build-kitchen-batch-payload';
import { buildOrderTabReceiptPayload } from '../utils/build-order-tab-receipt-payload';
import { buildItemChangePayload } from '../utils/build-item-change-payload';
import {
  buildBatchAddedIdempotencyKey,
  buildOrderTabPaidIdempotencyKey,
  buildItemUpdatedIdempotencyKey,
  buildItemRemovedIdempotencyKey,
} from '../utils/print-job-idempotency';
import { PrintJobsGateway } from '../gateways/print-jobs.gateway';
import { PrintJob } from '../entities/print-job';

type ItemSnapshot = {
  quantity: number;
  productName?: string;
  observation?: string;
  complements?: TableOrderItemComplement[];
};

export type PrintJobSourceContext = {
  sourceClientType?: PrintClientType;
  sourceDeviceId?: string;
  operatorName?: string;
  locationName?: string;
};

@Injectable()
export class PrintJobService {
  private readonly logger = new Logger(PrintJobService.name);

  constructor(
    private printJobDataSource: PrintJobDataSource,
    private locationPrintConfigDataSource: LocationPrintConfigDataSource,
    private tableOrderDataSource: TableOrderDataSource,
    private printJobsGateway: PrintJobsGateway,
  ) {}

  async createBatchAddedJob(params: {
    orderTab: OrderTab;
    batchId: string;
    affectedItems: BatchAffectedItem[];
    source?: PrintJobSourceContext;
  }): Promise<PrintJob | null> {
    if (params.affectedItems.length === 0) return null;

    try {
      const config =
        await this.locationPrintConfigDataSource.findOrCreateByLocation(
          params.orderTab.organizationId,
          params.orderTab.locationId,
        );

      const tableOrder = await this.tableOrderDataSource.findById(
        params.orderTab.tableOrderId,
        params.orderTab.organizationId,
      );

      const payload = buildKitchenBatchPayload({
        paperWidthMm: config.defaultPaperWidthMm,
        locationName: params.source?.locationName ?? 'Unidade',
        tableIdentifier: tableOrder?.table?.identifier ?? '—',
        orderTabSequence: params.orderTab.sequence,
        batchId: params.batchId,
        items: params.affectedItems,
        operatorName: params.source?.operatorName,
      });

      const job = await this.printJobDataSource.createOne({
        organizationId: params.orderTab.organizationId,
        locationId: params.orderTab.locationId,
        orderTabId: params.orderTab._id.toString(),
        batchId: params.batchId,
        trigger: PrintJobTrigger.ITEMS_BATCH_ADDED,
        targetStation: config.defaultStation,
        sourceClientType:
          params.source?.sourceClientType ?? PrintClientType.DESKTOP,
        sourceDeviceId: params.source?.sourceDeviceId,
        status: PrintJobStatus.PENDING,
        payload,
        idempotencyKey: buildBatchAddedIdempotencyKey(
          params.orderTab._id.toString(),
          params.batchId,
        ),
      });

      if (job) {
        this.printJobsGateway.emitPrintJobCreated(
          params.orderTab.locationId,
          job,
        );
      }

      return job;
    } catch (error) {
      this.logger.error('Failed to create batch print job', error);
      return null;
    }
  }

  async createOrderTabPaidJob(params: {
    orderTab: OrderTab;
    tableOrder?: TableOrder | null;
    source?: PrintJobSourceContext;
  }): Promise<PrintJob | null> {
    try {
      const config =
        await this.locationPrintConfigDataSource.findOrCreateByLocation(
          params.orderTab.organizationId,
          params.orderTab.locationId,
        );

      const tableOrder =
        params.tableOrder ??
        (await this.tableOrderDataSource.findById(
          params.orderTab.tableOrderId,
          params.orderTab.organizationId,
        ));

      const payload = buildOrderTabReceiptPayload({
        paperWidthMm: config.defaultPaperWidthMm,
        locationName: params.source?.locationName ?? 'Unidade',
        tableIdentifier: tableOrder?.table?.identifier ?? '—',
        orderTabSequence: params.orderTab.sequence,
        items: params.orderTab.items,
        pricing: params.orderTab.pricing,
        payment: params.orderTab.payment,
        operatorName: params.source?.operatorName,
      });

      const job = await this.printJobDataSource.createOne({
        organizationId: params.orderTab.organizationId,
        locationId: params.orderTab.locationId,
        orderTabId: params.orderTab._id.toString(),
        trigger: PrintJobTrigger.ORDER_TAB_PAID,
        targetStation: config.defaultStation,
        sourceClientType:
          params.source?.sourceClientType ?? PrintClientType.DESKTOP,
        sourceDeviceId: params.source?.sourceDeviceId,
        status: PrintJobStatus.PENDING,
        payload,
        idempotencyKey: buildOrderTabPaidIdempotencyKey(
          params.orderTab._id.toString(),
        ),
      });

      if (job) {
        this.printJobsGateway.emitPrintJobCreated(
          params.orderTab.locationId,
          job,
        );
      }

      return job;
    } catch (error) {
      this.logger.error('Failed to create paid print job', error);
      return null;
    }
  }

  async createItemUpdatedJob(params: {
    orderTab: OrderTab;
    itemId: string;
    itemBefore: ItemSnapshot;
    itemAfter: ItemSnapshot;
    changeId: string;
    source?: PrintJobSourceContext;
  }): Promise<PrintJob | null> {
    try {
      const config =
        await this.locationPrintConfigDataSource.findOrCreateByLocation(
          params.orderTab.organizationId,
          params.orderTab.locationId,
        );

      const tableOrder = await this.tableOrderDataSource.findById(
        params.orderTab.tableOrderId,
        params.orderTab.organizationId,
      );

      const payload = buildItemChangePayload({
        changeType: 'UPDATED',
        paperWidthMm: config.defaultPaperWidthMm,
        locationName: params.source?.locationName ?? 'Unidade',
        tableIdentifier: tableOrder?.table?.identifier ?? '—',
        orderTabSequence: params.orderTab.sequence,
        item: {
          itemId: params.itemId,
          productName: params.itemAfter.productName ?? 'Produto',
          observation: params.itemAfter.observation,
          complements: (params.itemAfter.complements ?? []).map(
            (complement) => ({
              name: complement.name,
              quantity: complement.quantity,
            }),
          ),
        },
        previousQuantity: params.itemBefore.quantity,
        quantity: params.itemAfter.quantity,
        operatorName: params.source?.operatorName,
      });

      const job = await this.printJobDataSource.createOne({
        organizationId: params.orderTab.organizationId,
        locationId: params.orderTab.locationId,
        orderTabId: params.orderTab._id.toString(),
        trigger: PrintJobTrigger.ITEM_UPDATED,
        targetStation: config.defaultStation,
        sourceClientType:
          params.source?.sourceClientType ?? PrintClientType.DESKTOP,
        sourceDeviceId: params.source?.sourceDeviceId,
        status: PrintJobStatus.PENDING,
        payload,
        idempotencyKey: buildItemUpdatedIdempotencyKey(
          params.orderTab._id.toString(),
          params.itemId,
          params.changeId,
        ),
      });

      if (job) {
        this.printJobsGateway.emitPrintJobCreated(
          params.orderTab.locationId,
          job,
        );
      }

      return job;
    } catch (error) {
      this.logger.error('Failed to create item updated print job', error);
      return null;
    }
  }

  async createItemRemovedJob(params: {
    orderTab: OrderTab;
    itemId: string;
    item: ItemSnapshot;
    removedQuantity: number;
    remainingQuantity: number;
    changeId: string;
    source?: PrintJobSourceContext;
  }): Promise<PrintJob | null> {
    try {
      const config =
        await this.locationPrintConfigDataSource.findOrCreateByLocation(
          params.orderTab.organizationId,
          params.orderTab.locationId,
        );

      const tableOrder = await this.tableOrderDataSource.findById(
        params.orderTab.tableOrderId,
        params.orderTab.organizationId,
      );

      const payload = buildItemChangePayload({
        changeType: 'REMOVED',
        paperWidthMm: config.defaultPaperWidthMm,
        locationName: params.source?.locationName ?? 'Unidade',
        tableIdentifier: tableOrder?.table?.identifier ?? '—',
        orderTabSequence: params.orderTab.sequence,
        item: {
          itemId: params.itemId,
          productName: params.item.productName ?? 'Produto',
          observation: params.item.observation,
          complements: (params.item.complements ?? []).map((complement) => ({
            name: complement.name,
            quantity: complement.quantity,
          })),
        },
        quantity: params.removedQuantity,
        remainingQuantity: params.remainingQuantity,
        operatorName: params.source?.operatorName,
      });

      const job = await this.printJobDataSource.createOne({
        organizationId: params.orderTab.organizationId,
        locationId: params.orderTab.locationId,
        orderTabId: params.orderTab._id.toString(),
        trigger: PrintJobTrigger.ITEM_REMOVED,
        targetStation: config.defaultStation,
        sourceClientType:
          params.source?.sourceClientType ?? PrintClientType.DESKTOP,
        sourceDeviceId: params.source?.sourceDeviceId,
        status: PrintJobStatus.PENDING,
        payload,
        idempotencyKey: buildItemRemovedIdempotencyKey(
          params.orderTab._id.toString(),
          params.itemId,
          params.changeId,
        ),
      });

      if (job) {
        this.printJobsGateway.emitPrintJobCreated(
          params.orderTab.locationId,
          job,
        );
      }

      return job;
    } catch (error) {
      this.logger.error('Failed to create item removed print job', error);
      return null;
    }
  }

  enqueueBatchAddedJob(
    params: Parameters<PrintJobService['createBatchAddedJob']>[0],
  ): void {
    void this.createBatchAddedJob(params);
  }

  enqueueOrderTabPaidJob(
    params: Parameters<PrintJobService['createOrderTabPaidJob']>[0],
  ): void {
    void this.createOrderTabPaidJob(params);
  }

  enqueueItemUpdatedJob(
    params: Parameters<PrintJobService['createItemUpdatedJob']>[0],
  ): void {
    void this.createItemUpdatedJob(params);
  }

  enqueueItemRemovedJob(
    params: Parameters<PrintJobService['createItemRemovedJob']>[0],
  ): void {
    void this.createItemRemovedJob(params);
  }

  createBatchId(): string {
    return randomUUID();
  }
}
