import { TableOrderPayment } from '../entities/table-order';
import { TableOrderItem } from '../entities/table-order-item';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';

export const formatPaymentInfo = (
  items: TableOrderItem[],
  paidAmount: number,
  instalments: number,
): TableOrderPayment => {
  const total = items.reduce((accum, item) => accum + item.total, 0);

  return {
    total,
    paidAmount,
    instalments,
    paymentStatus: TableOrderPaymentStatuses.PENDING,
  };
};
