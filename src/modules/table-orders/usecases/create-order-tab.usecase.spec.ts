import { CreateOrderTabUseCase } from './create-order-tab.usecase';
import { TableOrderStatuses } from '../enums/table-order-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { NoOpenLocationShiftException } from '@modules/location-shifts/errors/no-open-location-shift';

describe('CreateOrderTabUseCase', () => {
  const tableOrderDataSource = {
    findById: jest.fn(),
    pushTabId: jest.fn(),
    updateOne: jest.fn(),
  };

  const orderTabDataSource = {
    findByTableOrderId: jest.fn(),
    createOne: jest.fn(),
    findById: jest.fn(),
  };

  const productDataSource = {
    findManyByIds: jest.fn(),
  };
  const complementGroupDataSource = {
    findByIds: jest.fn().mockResolvedValue([]),
  };
  const complementDataSource = {
    listByGroupIds: jest.fn().mockResolvedValue([]),
  };
  const locationShiftDataSource = {
    findOpenByLocation: jest.fn(),
    incrementOrderTabsQuantity: jest.fn(),
  };
  const printJobService = {
    enqueueBatchAddedJob: jest.fn(),
  };

  const useCase = new CreateOrderTabUseCase(
    tableOrderDataSource as never,
    orderTabDataSource as never,
    productDataSource as never,
    complementGroupDataSource as never,
    complementDataSource as never,
    locationShiftDataSource as never,
    printJobService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    tableOrderDataSource.findById.mockResolvedValue({
      _id: 'order-1',
      status: TableOrderStatuses.IN_ATTENDANCE,
    });
    locationShiftDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'shift-id',
    });
    orderTabDataSource.findByTableOrderId.mockResolvedValue([]);
    orderTabDataSource.createOne.mockResolvedValue({
      _id: 'tab-1',
      sequence: 1,
    });
    orderTabDataSource.findById.mockResolvedValue({
      _id: 'tab-1',
      sequence: 1,
      items: [],
      status: OrderTabStatuses.IN_ATTENDANCE,
    });
  });

  it('cria comanda vazia com sequence 1', async () => {
    const result = await useCase.execute({
      tableOrderId: 'order-1',
      items: [],
      organizationId: 'org-1',
      locationId: 'loc-1',
      userId: 'user-1',
      roles: [],
    });

    expect(orderTabDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        sequence: 1,
        items: [],
        status: OrderTabStatuses.IN_ATTENDANCE,
        payment: expect.objectContaining({
          paymentStatus: TableOrderPaymentStatuses.PENDING,
        }),
      }),
    );
    expect(tableOrderDataSource.pushTabId).toHaveBeenCalledWith(
      'order-1',
      'org-1',
      'tab-1',
    );
    expect(locationShiftDataSource.incrementOrderTabsQuantity).toHaveBeenCalledWith(
      'shift-id',
      'org-1',
    );
    expect(result._id).toBe('tab-1');
  });

  it('incrementa sequence quando já existem tabs', async () => {
    orderTabDataSource.findByTableOrderId.mockResolvedValue([
      {
        _id: 'tab-existing',
        sequence: 1,
        pricing: { total: 10, discount: 0, fees: 0 },
        payment: {
          total: 10,
          paidAmount: 0,
          paymentStatus: TableOrderPaymentStatuses.PENDING,
          instalments: 0,
        },
        status: OrderTabStatuses.IN_ATTENDANCE,
      },
    ]);
    orderTabDataSource.createOne.mockResolvedValue({
      _id: 'tab-2',
      sequence: 2,
    });
    orderTabDataSource.findById.mockResolvedValue({
      _id: 'tab-2',
      sequence: 2,
    });

    await useCase.execute({
      tableOrderId: 'order-1',
      items: [],
      organizationId: 'org-1',
      locationId: 'loc-1',
      userId: 'user-1',
      roles: [],
    });

    expect(orderTabDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({ sequence: 2 }),
    );
  });

  it('rejeita criação de comanda quando não há turno aberto', async () => {
    locationShiftDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(
      useCase.execute({
        tableOrderId: 'order-1',
        items: [],
        organizationId: 'org-1',
        locationId: 'loc-1',
        userId: 'user-1',
        roles: [],
      }),
    ).rejects.toBeInstanceOf(NoOpenLocationShiftException);

    expect(orderTabDataSource.createOne).not.toHaveBeenCalled();
    expect(
      locationShiftDataSource.incrementOrderTabsQuantity,
    ).not.toHaveBeenCalled();
  });
});
