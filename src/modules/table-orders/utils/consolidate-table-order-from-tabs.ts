import { OrderTab } from '../entities/order-tab';
import { TableOrderPayment, TableOrderPricing } from '../entities/table-order';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { OrderTabStatuses } from '../enums/order-tab-statuses';

type DerivePaymentStatusInput = {
  orderTotal: number;
  paidAmount: number;
  tabs: OrderTab[];
};

export function derivePaymentStatus({
  orderTotal,
  paidAmount,
  tabs,
}: DerivePaymentStatusInput): TableOrderPaymentStatuses {
  if (paidAmount === 0 && orderTotal > 0) {
    return TableOrderPaymentStatuses.PENDING;
  }

  const hasOpenTabWithBalance = tabs.some(
    (tab) =>
      tab.status === OrderTabStatuses.IN_ATTENDANCE &&
      tab.paymentStatus !== TableOrderPaymentStatuses.PAID,
  );

  if (paidAmount > 0 && (paidAmount < orderTotal || hasOpenTabWithBalance)) {
    return TableOrderPaymentStatuses.PARTIALLY_PAID;
  }

  const allTabsClosed = tabs.every(
    (tab) =>
      tab.status === OrderTabStatuses.FINISHED ||
      tab.status === OrderTabStatuses.CANCELLED,
  );

  if (paidAmount >= orderTotal && allTabsClosed) {
    return TableOrderPaymentStatuses.PAID;
  }

  return TableOrderPaymentStatuses.PARTIALLY_PAID;
}

export function consolidateTableOrderFromTabs(tabs: OrderTab[]): {
  pricing: TableOrderPricing;
  payment: TableOrderPayment;
} {
  const sum = (values: number[]) =>
    values.reduce((accum, value) => accum + value, 0);

  const pricing: TableOrderPricing = {
    total: sum(tabs.map((tab) => tab.pricing.total)),
    discount: sum(tabs.map((tab) => tab.pricing.discount ?? 0)),
    fees: sum(tabs.map((tab) => tab.pricing.fees ?? 0)),
  };

  const paidAmount = sum(
    tabs.map((tab) =>
      sum(tab.payments.map((payment) => payment.paidAmount ?? 0)),
    ),
  );

  const paymentStatus = derivePaymentStatus({
    orderTotal: pricing.total,
    paidAmount,
    tabs,
  });

  return {
    pricing,
    payment: {
      total: pricing.total,
      paidAmount,
      paymentStatus,
      instalments: 0,
      method: undefined,
      // NUNCA propagar o carimbo de caixa para o pagamento DERIVADO da mesa:
      // a apuração de caixa lê exclusivamente `order_tabs`; se `table_orders`
      // também carregasse o id, tudo seria contado duas vezes (ADR-2).
      cashRegisterId: undefined,
      paidAt: undefined,
    },
  };
}
