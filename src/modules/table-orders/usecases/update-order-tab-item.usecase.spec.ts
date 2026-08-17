import { UpdateOrderTabItemUseCase } from './update-order-tab-item.usecase';
import { OrderTabStatuses } from '../enums/order-tab-statuses';

describe('UpdateOrderTabItemUseCase', () => {
  const existingItem = {
    _id: 'item-1',
    productId: 'p1',
    productName: 'Burger',
    quantity: 1,
    observation: '',
    complements: [],
    productPrice: 10,
    discount: 0,
    total: 10,
  };

  const tab = {
    _id: 'tab-1',
    tableOrderId: 'order-1',
    organizationId: 'org-1',
    locationId: 'loc-1',
    sequence: 1,
    status: OrderTabStatuses.IN_ATTENDANCE,
    items: [existingItem],
    pricing: { total: 10, discount: 0, fees: 0 },
    payment: { total: 10 },
  };

  const orderTabDataSource = {
    findById: jest.fn(),
    updateItem: jest.fn(),
    updateOne: jest.fn(),
    findByTableOrderId: jest.fn(),
  };
  const tableOrderDataSource = {
    updateOne: jest.fn(),
  };
  const productDataSource = {
    findById: jest.fn(),
  };
  const complementGroupDataSource = {
    findByIds: jest.fn().mockResolvedValue([]),
  };
  const complementDataSource = {
    listByGroupIds: jest.fn().mockResolvedValue([]),
  };
  const printJobService = {
    enqueueItemUpdatedJob: jest.fn(),
  };

  const useCase = new UpdateOrderTabItemUseCase(
    orderTabDataSource as never,
    tableOrderDataSource as never,
    productDataSource as never,
    complementGroupDataSource as never,
    complementDataSource as never,
    printJobService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    orderTabDataSource.findById.mockResolvedValue(tab);
    orderTabDataSource.findByTableOrderId.mockResolvedValue([tab]);
    productDataSource.findById.mockResolvedValue({
      _id: 'p1',
      organizationId: 'org-1',
      name: 'Burger',
      originalPrice: 10,
      isPromotionalPriceEnabled: false,
      isActive: true,
      complementGroups: [],
    });
  });

  it('dispara ticket de atualização quando a quantidade muda', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      locationId: 'loc-1',
      orderTabId: 'tab-1',
      itemId: 'item-1',
      quantity: 3,
    } as never);

    expect(printJobService.enqueueItemUpdatedJob).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 'item-1',
        itemBefore: expect.objectContaining({ quantity: 1 }),
        itemAfter: expect.objectContaining({ quantity: 3 }),
      }),
    );
  });

  it('não dispara ticket quando nada muda de fato', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      locationId: 'loc-1',
      orderTabId: 'tab-1',
      itemId: 'item-1',
      quantity: 1,
    } as never);

    expect(printJobService.enqueueItemUpdatedJob).not.toHaveBeenCalled();
  });
});
