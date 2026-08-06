import { OrderTab } from '../entities/order-tab';
import { TableOrderPricing } from '../entities/table-order';
import { calculateOrderItemsPrice } from './calculate-order-items-price';

type PricingResult = TableOrderPricing & {
  itemsPrice: number;
};

type Options = { payServiceTax: boolean };

export const calculateOrderTabPrice = (
  orderTab: OrderTab,
  { payServiceTax }: Options,
): PricingResult => {
  return calculateOrderItemsPrice(orderTab, { payServiceTax });
};
