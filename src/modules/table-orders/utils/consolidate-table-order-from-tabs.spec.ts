import { OrderTab } from '../entities/order-tab';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import {
  consolidateTableOrderFromTabs,
  derivePaymentStatus,
} from './consolidate-table-order-from-tabs';

const buildTab = (
  overrides: Partial<OrderTab> &
    Pick<OrderTab, 'pricing' | 'payments' | 'paymentStatus'>,
): OrderTab => ({
  _id: overrides._id ?? 'tab-id',
  tableOrderId: overrides.tableOrderId ?? 'order-id',
  organizationId: 'org-id',
  locationId: 'loc-id',
  sequence: overrides.sequence ?? 1,
  status: overrides.status ?? OrderTabStatuses.IN_ATTENDANCE,
  items: overrides.items ?? [],
  createdAt: new Date(),
  updatedAt: new Date(),
  pricing: overrides.pricing,
  payments: overrides.payments,
  paymentStatus: overrides.paymentStatus,
});

describe('consolidateTableOrderFromTabs', () => {
  it('retorna totais zerados e PAID quando não há tabs', () => {
    const result = consolidateTableOrderFromTabs([]);

    expect(result.pricing).toEqual({ total: 0, discount: 0, fees: 0 });
    expect(result.payment).toMatchObject({
      total: 0,
      paidAmount: 0,
      paymentStatus: TableOrderPaymentStatuses.PAID,
    });
  });

  it('consolida total de uma tab', () => {
    const result = consolidateTableOrderFromTabs([
      buildTab({
        pricing: { total: 50, discount: 0, fees: 0 },
        payments: [],
        paymentStatus: TableOrderPaymentStatuses.PENDING,
      }),
    ]);

    expect(result.pricing.total).toBe(50);
    expect(result.payment.paidAmount).toBe(0);
    expect(result.payment.paymentStatus).toBe(
      TableOrderPaymentStatuses.PENDING,
    );
  });

  it('soma múltiplos pagamentos de uma mesma tab (PIX parcial + Dinheiro)', () => {
    const result = consolidateTableOrderFromTabs([
      buildTab({
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 100, discount: 0, fees: 0 },
        payments: [
          { total: 100, paidAmount: 40 },
          { total: 100, paidAmount: 60 },
        ],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
    ]);

    expect(result.payment.paidAmount).toBe(100);
    expect(result.payment.paymentStatus).toBe(TableOrderPaymentStatuses.PAID);
  });

  it('retorna PARTIALLY_PAID quando uma tab foi paga e outra permanece aberta', () => {
    const result = consolidateTableOrderFromTabs([
      buildTab({
        sequence: 1,
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 30, discount: 0, fees: 0 },
        payments: [{ total: 30, paidAmount: 30 }],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
      buildTab({
        sequence: 2,
        status: OrderTabStatuses.IN_ATTENDANCE,
        pricing: { total: 20, discount: 0, fees: 0 },
        payments: [],
        paymentStatus: TableOrderPaymentStatuses.PENDING,
      }),
    ]);

    expect(result.pricing.total).toBe(50);
    expect(result.payment.paidAmount).toBe(30);
    expect(result.payment.paymentStatus).toBe(
      TableOrderPaymentStatuses.PARTIALLY_PAID,
    );
  });

  it('retorna PAID quando todas tabs estão finalizadas e pagas', () => {
    const result = consolidateTableOrderFromTabs([
      buildTab({
        sequence: 1,
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 50, discount: 0, fees: 0 },
        payments: [{ total: 50, paidAmount: 50 }],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
      buildTab({
        sequence: 2,
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 30, discount: 0, fees: 0 },
        payments: [{ total: 30, paidAmount: 30 }],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
    ]);

    expect(result.pricing.total).toBe(80);
    expect(result.payment.paidAmount).toBe(80);
    expect(result.payment.paymentStatus).toBe(TableOrderPaymentStatuses.PAID);
  });

  it('retorna PAID quando tab finalizada tem total zerado', () => {
    const result = consolidateTableOrderFromTabs([
      buildTab({
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 0, discount: 0, fees: 0 },
        payments: [],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
    ]);

    expect(result.pricing.total).toBe(0);
    expect(result.payment.paidAmount).toBe(0);
    expect(result.payment.paymentStatus).toBe(TableOrderPaymentStatuses.PAID);
  });

  it('NÃO propaga cashRegisterId nem paidAt para o pagamento derivado da mesa', () => {
    // Anti-dupla-contagem (ADR-2): a apuração de caixa lê exclusivamente
    // `order_tabs`. Se `table_orders` carregasse o mesmo id, cada pagamento
    // seria contado duas vezes no resumo do caixa.
    const result = consolidateTableOrderFromTabs([
      buildTab({
        status: OrderTabStatuses.FINISHED,
        pricing: { total: 100, discount: 0, fees: 0 },
        payments: [
          {
            total: 100,
            paidAmount: 100,
            instalments: 1,
            cashRegisterId: 'cash-register-id',
            paidAt: new Date('2026-08-31T12:00:00.000Z'),
          },
        ],
        paymentStatus: TableOrderPaymentStatuses.PAID,
      }),
    ]);

    expect(result.payment.cashRegisterId).toBeUndefined();
    expect(result.payment.paidAt).toBeUndefined();
    expect(result.payment.method).toBeUndefined();
  });
});

describe('derivePaymentStatus', () => {
  it('retorna PENDING quando paidAmount é zero e há valor a pagar', () => {
    expect(
      derivePaymentStatus({ orderTotal: 100, paidAmount: 0, tabs: [] }),
    ).toBe(TableOrderPaymentStatuses.PENDING);
  });

  it('retorna PAID quando paidAmount e orderTotal são zero', () => {
    expect(
      derivePaymentStatus({ orderTotal: 0, paidAmount: 0, tabs: [] }),
    ).toBe(TableOrderPaymentStatuses.PAID);
  });

  it('considera aberta uma tab IN_ATTENDANCE cujo paymentStatus não é PAID', () => {
    const openUnpaidTab = buildTab({
      status: OrderTabStatuses.IN_ATTENDANCE,
      pricing: { total: 20, discount: 0, fees: 0 },
      payments: [],
      paymentStatus: TableOrderPaymentStatuses.PARTIALLY_PAID,
    });

    expect(
      derivePaymentStatus({
        orderTotal: 100,
        paidAmount: 50,
        tabs: [openUnpaidTab],
      }),
    ).toBe(TableOrderPaymentStatuses.PARTIALLY_PAID);
  });
});
