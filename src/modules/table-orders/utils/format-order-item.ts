import { Product } from '@modules/products/entities/product';
import { TableOrderItem } from '../entities/table-order-item';

type OrderItemInfo = {
  quantity: number;
  observation?: string;
};

export const formatOrderItem = (
  itemInfo: OrderItemInfo,
  product: Product,
): TableOrderItem => {
  const productPrice = product.isPromotionalPriceEnabled
    ? product.promotionalPrice
    : product.originalPrice;

  const discount = product.originalPrice - productPrice;

  // add createdAt updatedAt
  // https://stackoverflow.com/questions/64385442/add-timestamp-to-a-new-subdocument-or-subschema-in-mongoose
  return {
    productId: product._id,
    discount,
    productPrice,
    quantity: itemInfo.quantity,
    total: productPrice * itemInfo.quantity,
    observation: itemInfo.observation || '',
  } as TableOrderItem;
};
