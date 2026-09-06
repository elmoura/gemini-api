import { PaymentMethods } from '@shared/enums/payment-methods';
import { CashRegisterPaymentSummaryDataSource } from './cash-register-payment-summary.datasource';

describe('CashRegisterPaymentSummaryDataSource', () => {
  const orderTabModel = {
    aggregate: jest.fn(),
  };

  const dataSource = new CashRegisterPaymentSummaryDataSource(
    orderTabModel as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    orderTabModel.aggregate.mockResolvedValue([]);
  });

  it('inclui organizationId e locationId no $match inicial (isolamento multi-tenant)', async () => {
    await dataSource.summarizeByCashRegister(
      'org-id',
      'location-id',
      'cash-register-id',
    );

    const [pipeline] = orderTabModel.aggregate.mock.calls[0];

    expect(pipeline[0]).toEqual({
      $match: {
        organizationId: 'org-id',
        locationId: 'location-id',
        'payments.cashRegisterId': 'cash-register-id',
      },
    });
  });

  it('desmembra payments[] e re-filtra por cashRegisterId pós-$unwind', async () => {
    await dataSource.summarizeByCashRegister('org-id', 'loc-id', 'cr-id');

    const [pipeline] = orderTabModel.aggregate.mock.calls[0];

    expect(pipeline[1]).toEqual({ $unwind: '$payments' });
    expect(pipeline[2]).toEqual({
      $match: { 'payments.cashRegisterId': 'cr-id' },
    });
  });

  it('agrupa por método de pagamento somando paidAmount', async () => {
    await dataSource.summarizeByCashRegister('org-id', 'loc-id', 'cr-id');

    const [pipeline] = orderTabModel.aggregate.mock.calls[0];

    expect(pipeline[3]).toEqual({
      $group: {
        _id: '$payments.method',
        total: { $sum: '$payments.paidAmount' },
        count: { $sum: 1 },
      },
    });
  });

  it('soma em totalCashPayments APENAS o bucket de dinheiro', async () => {
    orderTabModel.aggregate.mockResolvedValue([
      { _id: PaymentMethods.CASH, total: 120.5, count: 2 },
      { _id: PaymentMethods.PIX, total: 400, count: 1 },
      { _id: PaymentMethods.CREDIT_CARD, total: 350, count: 3 },
      { _id: PaymentMethods.DEBIT_CARD, total: 250, count: 2 },
    ]);

    const summary = await dataSource.summarizeByCashRegister(
      'org-id',
      'loc-id',
      'cr-id',
    );

    expect(summary.totalCashPayments).toBe(120.5);
    expect(summary.totalNonCashPayments).toBe(1000);
    expect(summary.paymentsCount).toBe(8);
  });

  it('mantém crédito e débito separados em byMethod', async () => {
    orderTabModel.aggregate.mockResolvedValue([
      { _id: PaymentMethods.CREDIT_CARD, total: 350, count: 3 },
      { _id: PaymentMethods.DEBIT_CARD, total: 250, count: 2 },
    ]);

    const summary = await dataSource.summarizeByCashRegister(
      'org-id',
      'loc-id',
      'cr-id',
    );

    expect(summary.byMethod).toEqual([
      { method: PaymentMethods.CREDIT_CARD, total: 350, count: 3 },
      { method: PaymentMethods.DEBIT_CARD, total: 250, count: 2 },
    ]);
  });

  it('arredonda valores monetários a 2 casas', async () => {
    orderTabModel.aggregate.mockResolvedValue([
      { _id: PaymentMethods.CASH, total: 10.005, count: 1 },
      { _id: PaymentMethods.PIX, total: 0.1 + 0.2, count: 1 },
    ]);

    const summary = await dataSource.summarizeByCashRegister(
      'org-id',
      'loc-id',
      'cr-id',
    );

    expect(summary.totalCashPayments).toBe(10.01);
    expect(summary.totalNonCashPayments).toBe(0.3);
  });

  it('retorna resumo zerado quando o caixa não teve pagamentos', async () => {
    const summary = await dataSource.summarizeByCashRegister(
      'org-id',
      'loc-id',
      'cr-id',
    );

    expect(summary).toEqual({
      totalCashPayments: 0,
      totalNonCashPayments: 0,
      byMethod: [],
      paymentsCount: 0,
    });
  });
});
