import { TableOrder, TableOrderPricing } from '../entities/table-order';

type PricingResult = TableOrderPricing & {
  itemsPrice: number;
};

type Options = { payServiceTax: boolean };

export const calculateTableOrderPrice = (
  tableOrder: TableOrder,
  { payServiceTax }: Options,
): PricingResult => {
  const itemsPrice = tableOrder.items.reduce(
    (total, currentItem) =>
      total + currentItem.productPrice * currentItem.quantity,
    0,
  );

  const discount = tableOrder.pricing.discount || 0;
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
