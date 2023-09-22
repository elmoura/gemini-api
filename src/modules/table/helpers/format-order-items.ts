import { Product } from '@modules/products/entities/product';
import { TableOrderItem } from '../entities/table-order-item';

interface IProductWithQuantity extends Product {
  quantity: number;
}

export const formatOrderItems = (
  products: IProductWithQuantity[],
): TableOrderItem[] => {
  return products.map((product) => {
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
      quantity: product.quantity,
      total: productPrice * product.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};
