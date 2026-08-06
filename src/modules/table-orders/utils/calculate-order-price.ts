import { TableOrderItem } from '../entities/table-order-item';
import { calculateOrderItemsPrice } from './calculate-order-items-price';

type PricingResult = ReturnType<typeof calculateOrderItemsPrice>;

type OrderWithItems = {
  items: TableOrderItem[];
  pricing: { discount?: number };
};

type Options = { payServiceTax: boolean };

/** @deprecated Use calculateOrderTabPrice for OrderTab documents */
export const calculateTableOrderPrice = (
  order: OrderWithItems,
  options: Options,
): PricingResult => {
  return calculateOrderItemsPrice(order, options);
};
