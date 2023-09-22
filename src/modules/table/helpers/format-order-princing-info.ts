import { TableOrderPricing } from '../entities/table-order';
import { TableOrderItem } from '../entities/table-order-item';

export const formatPricingInfo = (
  items: TableOrderItem[],
  fees: number,
): TableOrderPricing => {
  const total = items.reduce((accum, item) => accum + item.total, 0);
  const discount = items.reduce((accum, item) => accum + item.discount, 0);

  return {
    total,
    discount,
    fees,
  };
};
