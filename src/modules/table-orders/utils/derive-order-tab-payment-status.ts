import { TableOrderPayment } from '../entities/table-order';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';

/**
 * Status agregado de uma `OrderTab` a partir de `payments[]` (B2). Guarda de
 * `total > 0` no caso PENDING replica o mesmo tratamento de tab de total zero
 * já usado em `derivePaymentStatus` (nível `TableOrder`) — sem ela, uma tab
 * com `pricing.total === 0` nunca sairia de PENDING e `finishOrderTab` jamais
 * conseguiria finalizá-la.
 */
export function deriveOrderTabPaymentStatus(
  payments: TableOrderPayment[],
  total: number,
): TableOrderPaymentStatuses {
  const paidAmount = payments.reduce(
    (sum, payment) => sum + (payment.paidAmount ?? 0),
    0,
  );

  if (paidAmount === 0 && total > 0) {
    return TableOrderPaymentStatuses.PENDING;
  }

  if (paidAmount >= total) {
    return TableOrderPaymentStatuses.PAID;
  }

  return TableOrderPaymentStatuses.PARTIALLY_PAID;
}
