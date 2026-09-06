import { PrintJobService } from '../services/print-job.service';
import { PrintJobTrigger } from '../enums/print-job-trigger';
import { PrintJobStatus } from '../enums/print-job-status';
import { PrintStation } from '../enums/print-station';
import { PrintClientType } from '../enums/print-client-type';
import { OrderTabStatuses } from '@modules/table-orders/enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '@modules/table-orders/enums/table-order-statuses';

describe('PrintJobService', () => {
  const printJobDataSource = {
    createOne: jest.fn(),
  };
  const locationPrintConfigDataSource = {
    findOrCreateByLocation: jest.fn(),
  };
  const tableOrderDataSource = {
    findById: jest.fn(),
  };
  const printJobsGateway = {
    emitPrintJobCreated: jest.fn(),
  };

  const service = new PrintJobService(
    printJobDataSource as never,
    locationPrintConfigDataSource as never,
    tableOrderDataSource as never,
    printJobsGateway as never,
  );

  const orderTab = {
    _id: 'tab-1',
    tableOrderId: 'order-1',
    organizationId: 'org-1',
    locationId: 'loc-1',
    sequence: 1,
    status: OrderTabStatuses.IN_ATTENDANCE,
    items: [
      {
        _id: 'item-1',
        productId: 'p1',
        productName: 'Burger',
        quantity: 2,
        discount: 0,
        productPrice: 10,
        total: 20,
        complements: [],
      },
    ],
    pricing: { total: 20, discount: 0, fees: 0 },
    payments: [
      {
        total: 20,
        paidAmount: 20,
        instalments: 1,
      },
    ],
    paymentStatus: TableOrderPaymentStatuses.PAID,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    locationPrintConfigDataSource.findOrCreateByLocation.mockResolvedValue({
      defaultStation: PrintStation.KITCHEN,
      defaultPaperWidthMm: 80,
    });
    tableOrderDataSource.findById.mockResolvedValue({
      table: { identifier: 'Mesa 12' },
    });
    printJobDataSource.createOne.mockResolvedValue({
      _id: 'job-1',
      trigger: PrintJobTrigger.ITEMS_BATCH_ADDED,
      status: PrintJobStatus.PENDING,
    });
  });

  it('createBatchAddedJob cria 1 job com N itens', async () => {
    await service.createBatchAddedJob({
      orderTab: orderTab as never,
      batchId: 'batch-1',
      affectedItems: [
        { itemId: 'i1', productName: 'Burger', quantity: 2, complements: [] },
        { itemId: 'i2', productName: 'Coca', quantity: 1, complements: [] },
      ],
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: PrintJobTrigger.ITEMS_BATCH_ADDED,
        batchId: 'batch-1',
        payload: expect.objectContaining({
          template: 'KITCHEN_BATCH',
          items: expect.arrayContaining([
            expect.objectContaining({ productName: 'Burger' }),
            expect.objectContaining({ productName: 'Coca' }),
          ]),
        }),
      }),
    );
    expect(printJobsGateway.emitPrintJobCreated).toHaveBeenCalled();
  });

  it('createOrderTabPaidJob cria job consolidado', async () => {
    printJobDataSource.createOne.mockResolvedValue({
      _id: 'job-2',
      trigger: PrintJobTrigger.ORDER_TAB_PAID,
    });

    await service.createOrderTabPaidJob({
      orderTab: orderTab as never,
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: PrintJobTrigger.ORDER_TAB_PAID,
        payload: expect.objectContaining({
          template: 'ORDER_TAB_RECEIPT',
          items: expect.arrayContaining([
            expect.objectContaining({ productName: 'Burger' }),
          ]),
        }),
      }),
    );
  });

  it('createBatchAddedJob usa DESKTOP como default e propaga source informado', async () => {
    await service.createBatchAddedJob({
      orderTab: orderTab as never,
      batchId: 'batch-1',
      affectedItems: [
        { itemId: 'i1', productName: 'Burger', quantity: 2, complements: [] },
      ],
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({ sourceClientType: PrintClientType.DESKTOP }),
    );

    await service.createBatchAddedJob({
      orderTab: orderTab as never,
      batchId: 'batch-2',
      affectedItems: [
        { itemId: 'i1', productName: 'Burger', quantity: 2, complements: [] },
      ],
      source: {
        sourceClientType: PrintClientType.MOBILE,
        sourceDeviceId: 'device-1',
      },
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceClientType: PrintClientType.MOBILE,
        sourceDeviceId: 'device-1',
      }),
    );
  });

  it('createItemUpdatedJob cria job com quantidade anterior e nova', async () => {
    printJobDataSource.createOne.mockResolvedValue({
      _id: 'job-3',
      trigger: PrintJobTrigger.ITEM_UPDATED,
      targetStation: PrintStation.KITCHEN,
    });

    await service.createItemUpdatedJob({
      orderTab: orderTab as never,
      itemId: 'item-1',
      itemBefore: { quantity: 1, productName: 'Burger', complements: [] },
      itemAfter: { quantity: 3, productName: 'Burger', complements: [] },
      changeId: 'change-1',
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: PrintJobTrigger.ITEM_UPDATED,
        idempotencyKey: 'tab-1:item-1:change-1:ITEM_UPDATED',
        payload: expect.objectContaining({
          template: 'ITEM_UPDATED',
          item: expect.objectContaining({ previousQuantity: 1, quantity: 3 }),
        }),
      }),
    );
    expect(printJobsGateway.emitPrintJobCreated).toHaveBeenCalled();
  });

  it('createItemRemovedJob cria job com quantidade removida e restante', async () => {
    printJobDataSource.createOne.mockResolvedValue({
      _id: 'job-4',
      trigger: PrintJobTrigger.ITEM_REMOVED,
      targetStation: PrintStation.KITCHEN,
    });

    await service.createItemRemovedJob({
      orderTab: orderTab as never,
      itemId: 'item-1',
      item: { quantity: 2, productName: 'Burger', complements: [] },
      removedQuantity: 1,
      remainingQuantity: 1,
      changeId: 'change-2',
    });

    expect(printJobDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: PrintJobTrigger.ITEM_REMOVED,
        idempotencyKey: 'tab-1:item-1:change-2:ITEM_REMOVED',
        payload: expect.objectContaining({
          template: 'ITEM_REMOVED',
          item: expect.objectContaining({ quantity: 1, remainingQuantity: 1 }),
        }),
      }),
    );
    expect(printJobsGateway.emitPrintJobCreated).toHaveBeenCalled();
  });
});
