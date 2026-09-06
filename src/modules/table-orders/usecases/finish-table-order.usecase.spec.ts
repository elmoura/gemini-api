import { FinishTableOrderUseCase } from './finish-table-order.usecase';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderNotUpdated } from '../errors/table-order-not-updated';

describe('FinishTableOrderUseCase', () => {
  const tableOrderDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };
  const orderTabDataSource = {
    findByTableOrderId: jest.fn(),
  };

  const useCase = new FinishTableOrderUseCase(
    tableOrderDataSource as never,
    orderTabDataSource as never,
  );

  const finishedTableOrder = {
    _id: 'order-id',
    status: TableOrderStatuses.IN_ATTENDANCE,
    organizationId: 'org-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tableOrderDataSource.findById
      .mockResolvedValueOnce(finishedTableOrder)
      .mockResolvedValueOnce({
        ...finishedTableOrder,
        status: TableOrderStatuses.FINISHED,
        payment: { paymentStatus: TableOrderPaymentStatuses.PAID },
      });
    tableOrderDataSource.updateOne.mockResolvedValue(true);
    orderTabDataSource.findByTableOrderId.mockResolvedValue([
      {
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 0, discount: 0, fees: 0 },
        payments: [],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      },
    ]);
  });

  it('finaliza mesa quando última comanda fechada tem total zerado', async () => {
    const result = await useCase.execute({
      tableOrderId: 'order-id',
      organizationId: 'org-id',
    });

    expect(result.status).toBe(TableOrderStatuses.FINISHED);
    expect(tableOrderDataSource.updateOne).toHaveBeenCalledWith(
      'order-id',
      'org-id',
      expect.objectContaining({
        status: TableOrderStatuses.FINISHED,
        payment: expect.objectContaining({
          paymentStatus: TableOrderPaymentStatuses.PAID,
        }),
      }),
    );
  });

  it('rejeita mesa com pagamento pendente quando há valor em aberto', async () => {
    orderTabDataSource.findByTableOrderId.mockResolvedValue([
      {
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 50, discount: 0, fees: 0 },
        payments: [],
        paymentStatus: TableOrderPaymentStatuses.PENDING,
      },
    ]);

    await expect(
      useCase.execute({
        tableOrderId: 'order-id',
        organizationId: 'org-id',
      }),
    ).rejects.toBeInstanceOf(TableOrderNotUpdated);
  });
});
