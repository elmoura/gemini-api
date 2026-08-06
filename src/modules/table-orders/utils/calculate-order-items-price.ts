import { TableOrderItem } from '../entities/table-order-item';
import { TableOrderPricing } from '../entities/table-order';
import { calculateItemLineTotal } from './calculate-item-line-total';

type PricingResult = TableOrderPricing & {
  itemsPrice: number;
};

type OrderWithItems = {
  items: TableOrderItem[];
  pricing: { discount?: number };
};

type Options = { payServiceTax: boolean };

export const calculateOrderItemsPrice = (
  order: OrderWithItems,
  { payServiceTax }: Options,
): PricingResult => {
  const itemsPrice = order.items.reduce(
    (total, currentItem) => total + calculateItemLineTotal(currentItem),
    0,
  );

  const discount = order.pricing.discount || 0;
  let total = itemsPrice - discount;
  const serviceTax = payServiceTax ? total * 0.1 : 0;
  total = payServiceTax ? total + serviceTax : total;

  return {
    total,
    itemsPrice,
    discount,
    fees: serviceTax,
  };
};
