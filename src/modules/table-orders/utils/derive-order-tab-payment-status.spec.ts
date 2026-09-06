import { TableOrderPayment } from '../entities/table-order';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { deriveOrderTabPaymentStatus } from './derive-order-tab-payment-status';

const payment = (paidAmount: number): TableOrderPayment => ({
  total: paidAmount,
  paidAmount,
});

describe('deriveOrderTabPaymentStatus', () => {
  it('retorna PENDING quando não há pagamentos e o total é positivo', () => {
    expect(deriveOrderTabPaymentStatus([], 100)).toBe(
      TableOrderPaymentStatuses.PENDING,
    );
  });

  it('retorna PARTIALLY_PAID quando a soma cobre parte do total', () => {
    expect(deriveOrderTabPaymentStatus([payment(40)], 100)).toBe(
      TableOrderPaymentStatuses.PARTIALLY_PAID,
    );
  });

  it('soma múltiplos pagamentos (ex: PIX parcial + Dinheiro)', () => {
    expect(deriveOrderTabPaymentStatus([payment(40), payment(60)], 100)).toBe(
      TableOrderPaymentStatuses.PAID,
    );
  });

  it('retorna PAID quando a soma cobre o total exatamente', () => {
    expect(deriveOrderTabPaymentStatus([payment(100)], 100)).toBe(
      TableOrderPaymentStatuses.PAID,
    );
  });

  it('retorna PAID quando total é zero, mesmo sem pagamentos', () => {
    expect(deriveOrderTabPaymentStatus([], 0)).toBe(
      TableOrderPaymentStatuses.PAID,
    );
  });

  it('trata paidAmount ausente como zero', () => {
    expect(
      deriveOrderTabPaymentStatus(
        [{ total: 0, paidAmount: undefined as unknown as number }],
        100,
      ),
    ).toBe(TableOrderPaymentStatuses.PENDING);
  });
});
