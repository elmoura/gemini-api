import { RemoveOrderTabItemUseCase } from './remove-order-tab-item.usecase';
import { OrderTabStatuses } from '../enums/order-tab-statuses';

describe('RemoveOrderTabItemUseCase', () => {
  const orderItem = {
    _id: 'item-1',
    productId: 'p1',
    productName: 'Burger',
    quantity: 3,
    observation: '',
    complements: [],
    productPrice: 10,
    discount: 0,
    total: 30,
  };

  function buildTab() {
    return {
      _id: 'tab-1',
      tableOrderId: 'order-1',
      organizationId: 'org-1',
      locationId: 'loc-1',
      sequence: 1,
      status: OrderTabStatuses.IN_ATTENDANCE,
      items: [{ ...orderItem }],
      pricing: { total: 30, discount: 0, fees: 0 },
      payments: [],
    };
  }

  const orderTabDataSource = {
    findById: jest.fn(),
    removeItem: jest.fn(),
    updateItem: jest.fn(),
    updateOne: jest.fn(),
    findByTableOrderId: jest.fn(),
  };
  const tableOrderDataSource = {
    updateOne: jest.fn(),
  };
  const printJobService = {
    enqueueItemRemovedJob: jest.fn(),
  };

  const useCase = new RemoveOrderTabItemUseCase(
    orderTabDataSource as never,
    tableOrderDataSource as never,
    printJobService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    const tab = buildTab();
    orderTabDataSource.findById.mockResolvedValue(tab);
    orderTabDataSource.findByTableOrderId.mockResolvedValue([tab]);
  });

  it('remoção total: removedQuantity = quantidade do item, remainingQuantity = 0', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      orderTabId: 'tab-1',
      itemId: 'item-1',
    } as never);

    expect(orderTabDataSource.removeItem).toHaveBeenCalledWith(
      'tab-1',
      'item-1',
    );
    expect(printJobService.enqueueItemRemovedJob).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 'item-1',
        removedQuantity: 3,
        remainingQuantity: 0,
      }),
    );
  });

  it('remoção parcial: removedQuantity = quantidade informada, remainingQuantity = restante', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      orderTabId: 'tab-1',
      itemId: 'item-1',
      quantity: 1,
    } as never);

    expect(orderTabDataSource.updateItem).toHaveBeenCalled();
    expect(orderTabDataSource.removeItem).not.toHaveBeenCalled();
    expect(printJobService.enqueueItemRemovedJob).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 'item-1',
        removedQuantity: 1,
        remainingQuantity: 2,
      }),
    );
  });
});
