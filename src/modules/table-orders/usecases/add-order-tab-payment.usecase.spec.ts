import { CashRegisterNotOpenException } from '@modules/cash-registers/errors/cash-register-not-open.exception';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { PaymentExceedsTotalException } from '../errors/payment-exceeds-total';
import { AddOrderTabPaymentUseCase } from './add-order-tab-payment.usecase';

describe('AddOrderTabPaymentUseCase', () => {
  const orderTabDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
  };

  const useCase = new AddOrderTabPaymentUseCase(
    orderTabDataSource as never,
    cashRegisterDataSource as never,
  );

  const openTab = {
    _id: 'tab-id',
    tableOrderId: 'order-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    sequence: 1,
    status: OrderTabStatuses.IN_ATTENDANCE,
    pricing: { total: 100, discount: 0, fees: 0 },
    payments: [],
    paymentStatus: TableOrderPaymentStatuses.PENDING,
    items: [],
  };

  const input = {
    orderTabId: 'tab-id',
    organizationId: 'org-id',
    method: PaymentMethods.PIX,
    amount: 40,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    orderTabDataSource.findById.mockResolvedValue(openTab);
    orderTabDataSource.updateOne.mockResolvedValue(true);
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'cash-register-id',
      organizationId: 'org-id',
      locationId: 'location-id',
    });
  });

  it('grava o pagamento com cashRegisterId e paidAt e recalcula paymentStatus', async () => {
    await useCase.execute(input as never);

    expect(orderTabDataSource.updateOne).toHaveBeenCalledWith(
      'tab-id',
      'org-id',
      expect.objectContaining({
        payments: [
          expect.objectContaining({
            method: PaymentMethods.PIX,
            paidAmount: 40,
            cashRegisterId: 'cash-register-id',
            paidAt: expect.any(Date),
          }),
        ],
        paymentStatus: TableOrderPaymentStatuses.PARTIALLY_PAID,
      }),
    );
  });

  it('soma múltiplos pagamentos (PIX parcial + Dinheiro) até completar PAID', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...openTab,
      payments: [
        {
          total: 100,
          paidAmount: 40,
          method: PaymentMethods.PIX,
          instalments: 0,
          cashRegisterId: 'cash-register-id',
          paidAt: new Date('2026-08-31T12:00:00.000Z'),
        },
      ],
    });

    await useCase.execute({
      ...input,
      method: PaymentMethods.CASH,
      amount: 60,
    } as never);

    expect(orderTabDataSource.updateOne).toHaveBeenCalledWith(
      'tab-id',
      'org-id',
      expect.objectContaining({
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
    );
  });

  it('rejeita quando não há caixa aberto na unidade', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      CashRegisterNotOpenException,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('rejeita overpayment quando o valor ultrapassa o total pendente', async () => {
    await expect(
      useCase.execute({ ...input, amount: 150 } as never),
    ).rejects.toBeInstanceOf(PaymentExceedsTotalException);

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('rejeita quando a comanda não existe na organização (multi-tenant)', async () => {
    orderTabDataSource.findById.mockResolvedValue(null);

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotFoundException,
    );

    expect(cashRegisterDataSource.findOpenByLocation).not.toHaveBeenCalled();
    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('rejeita quando a comanda não está em atendimento', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...openTab,
      status: OrderTabStatuses.FINISHED,
    });

    await expect(useCase.execute(input as never)).rejects.toBeInstanceOf(
      OrderTabNotUpdated,
    );

    expect(orderTabDataSource.updateOne).not.toHaveBeenCalled();
  });

  it('cada pagamento carrega o cashRegisterId do caixa aberto no momento daquele pagamento (troca de caixa)', async () => {
    orderTabDataSource.findById.mockResolvedValue({
      ...openTab,
      payments: [
        {
          total: 100,
          paidAmount: 40,
          method: PaymentMethods.PIX,
          instalments: 0,
          cashRegisterId: 'cash-register-A',
          paidAt: new Date('2026-08-31T12:00:00.000Z'),
        },
      ],
    });
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'cash-register-B',
      organizationId: 'org-id',
      locationId: 'location-id',
    });

    await useCase.execute({
      ...input,
      method: PaymentMethods.CASH,
      amount: 60,
    } as never);

    const [, , data] = orderTabDataSource.updateOne.mock.calls[0];

    expect(data.payments).toEqual([
      expect.objectContaining({ cashRegisterId: 'cash-register-A' }),
      expect.objectContaining({ cashRegisterId: 'cash-register-B' }),
    ]);
  });
});
