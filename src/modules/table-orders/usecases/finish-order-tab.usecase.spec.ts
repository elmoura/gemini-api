import { PaymentMethods } from '@shared/enums/payment-methods';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { OrderTabNotFullyPaidException } from '../errors/order-tab-not-fully-paid';
import { FinishOrderTabUseCase } from './finish-order-tab.usecase';

describe('FinishOrderTabUseCase', () => {
  const orderTabDataSource = {
    findById: jest.fn(),
    findByTableOrderId: jest.fn(),
    updateOne: jest.fn(),
  };
  const tableOrderDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };
  const printJobService = {
    enqueueOrderTabPaidJob: jest.fn(),
  };

  const useCase = new FinishOrderTabUseCase(
    orderTabDataSource as never,
    tableOrderDataSource as never,
    printJobService as never,
  );

  const paidTab = {
    _id: 'tab-id',
    tableOrderId: 'order-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    sequence: 1,
    status: OrderTabStatuses.IN_ATTENDANCE,
    pricing: { total: 100, discount: 0, fees: 0 },
    payments: [
      {
        total: 100,
        paidAmount: 100,
        method: PaymentMethods.CASH,
        instalments: 1,
        cashRegisterId: 'cash-register-id',
        paidAt: new Date('2026-08-31T12:00:00.000Z'),
      },
    ],
    paymentStatus: TableOrderPaymentStatuses.PAID,
    items: [],
  };

  const input = {
    orderTabId: 'tab-id',
    organizationId: 'org-id',
    payServiceTax: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    orderTabDataSource.findById.mockResolvedValue(paidTab);
    orderTabDataSource.findByTableOrderId.mockResolvedValue([
      { ...paidTab, status: OrderTabStatuses.FINISHED },
    ]);
    orderTabDataSource.updateOne.mockResolvedValue(true);
    tableOrderDataSource.findById.mockResolvedValue({
      _id: 'order-id',
      organizationId: 'org-id',
    });
    tableOrderDataSource.updateOne.mockResolvedValue(true);
  });

  it('finaliza a comanda totalmente paga', async () => {
    await useCase.execute(input as never);

    expect(orderTabDataSource.updateOne).toHaveBeenCalledWith(
      'tab-id',
      'org-id',
      expect.objectContaining({
        status: OrderTabStatuses.FINISHED,
      }),
    );
  });

  it('rejeita finalizar comanda não totalmente paga', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...paidTab,
      payments: [],
      paymentStatus: TableOrderPaymentStatuses.PENDING,
    });

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotFullyPaidException,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
    expect(printJobService.enqueueOrderTabPaidJob).not.toHaveBeenCalled();
  });

  it('rejeita finalizar comanda paga parcialmente', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...paidTab,
      payments: [{ total: 100, paidAmount: 40, method: PaymentMethods.PIX }],
      paymentStatus: TableOrderPaymentStatuses.PARTIALLY_PAID,
    });

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotFullyPaidException,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('rejeita quando a comanda não existe na organização (multi-tenant)', async () => {
    orderTabDataSource.findById.mockResolvedValue(null);

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotFoundException,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('rejeita quando a comanda não está em atendimento', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...paidTab,
      status: OrderTabStatuses.FINISHED,
    });

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotUpdated,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('aplica taxa de serviço no total da comanda quando solicitado', async () => {
    await useCase.execute({ ...input, payServiceTax: true } as never);

    expect(orderTabDataSource.updateOne).toHaveBeenCalledWith(
      'tab-id',
      'org-id',
      expect.objectContaining({
        pricing: expect.objectContaining({ fees: 10, total: 110 }),
      }),
    );
  });

  it('enfileira o job de impressão do cupom após finalizar', async () => {
    await useCase.execute(input as never);

    expect(printJobService.enqueueOrderTabPaidJob).toHaveBeenCalledWith(
      expect.objectContaining({ orderTab: paidTab }),
    );
  });
});
