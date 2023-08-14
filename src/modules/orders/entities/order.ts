import { Product } from '@modules/products/entities/product';
import { Customer } from '@modules/customers/entities/customer';

export class Order {
  _id: string;

  orderStatus: string; // transformar em enum

  organizationId: string;

  // organizationLocationId: string (como selecionar essa porra?)

  isDelivery: boolean;

  /**
   * @todo
   */
  paymentInfo: {};

  /**
   * @todo
   */
  // cadastro desse cara vem antes de finalizar o pedido
  deliveryAddress?: {};

  /**
   * @todo
   */
  // seria isso o cart?
  items: Product[];

  customer?: Customer;
}
