import { Product } from '@modules/products/entities/product';
import { TableOrderItem, TableOrderItemComplement } from '../entities/table-order-item';
import { calculateItemLineTotal } from './calculate-item-line-total';

type OrderItemInfo = {
  quantity: number;
  observation?: string;
  complements?: TableOrderItemComplement[];
};

export const formatOrderItem = (
  itemInfo: OrderItemInfo,
  product: Product,
): TableOrderItem => {
  const productPrice = product.isPromotionalPriceEnabled
    ? product.promotionalPrice
    : product.originalPrice;

  const discount = product.originalPrice - productPrice;
  const complements = itemInfo.complements ?? [];

  const item = {
    productId: product._id,
    productName: product.name,
    discount,
    productPrice,
    quantity: itemInfo.quantity,
    complements,
    observation: itemInfo.observation || '',
  } as TableOrderItem;

  return {
    ...item,
    total: calculateItemLineTotal(item),
  };
};
