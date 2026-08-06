import {
  TableOrderPayment,
  TableOrderPricing,
  TableOrder,
} from '@modules/table-orders/entities/table-order';
import { OrderTab } from '@modules/table-orders/entities/order-tab';
import { TableOrderItem } from '../../entities/table-order-item';
import {
  TableOrderStatuses,
  TableOrderPaymentStatuses,
} from '../../enums/table-order-statuses';
import { OrderTabStatuses } from '../../enums/order-tab-statuses';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { Table } from '@modules/table/entities/table';
import { Types } from 'mongoose';

@ObjectType()
export class OrderPriceInfo implements TableOrderPricing {
  @Field()
  total: number;

  @Field({ nullable: true })
  fees: number;

  @Field()
  discount: number;
}

registerEnumType(TableOrderPaymentStatuses, {
  name: 'TableOrderPaymentStatuses',
});

registerEnumType(PaymentMethods, { name: 'PaymentMethods' });

@ObjectType()
export class OrderPaymentInfo implements TableOrderPayment {
  @Field()
  total: number;

  @Field()
  paidAmount: number;

  @Field(() => TableOrderPaymentStatuses)
  paymentStatus: TableOrderPaymentStatuses;

  @Field(() => PaymentMethods, { nullable: true })
  method?: PaymentMethods;

  @Field()
  instalments?: number;
}

@ObjectType()
class TableInfo implements Pick<Table, '_id' | 'identifier'> {
  @Field()
  _id: string;

  @Field()
  identifier: string;
}

@ObjectType()
export class TableOrderItemComplementObj {
  @Field()
  complementId: string;

  @Field()
  complementGroupId: string;

  @Field()
  name: string;

  @Field()
  unitPrice: number;

  @Field()
  quantity: number;
}

@ObjectType()
export class TableOrderItemObj implements TableOrderItem {
  @Field()
  _id: string;

  @Field()
  quantity: number;

  @Field()
  productId: string;

  @Field({ nullable: true })
  productName?: string;

  @Field()
  discount: number;

  @Field()
  productPrice: number;

  @Field({ nullable: true })
  observation?: string;

  @Field(() => [TableOrderItemComplementObj], { nullable: true })
  complements?: TableOrderItemComplementObj[];

  @Field()
  total: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

registerEnumType(TableOrderStatuses, { name: 'TableOrderStatuses' });

registerEnumType(OrderTabStatuses, { name: 'OrderTabStatuses' });

@ObjectType()
export class OrderTabObj implements OrderTab {
  @Field()
  _id: string;

  @Field()
  tableOrderId: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  sequence: number;

  @Field(() => OrderTabStatuses)
  status: OrderTabStatuses;

  @Field(() => OrderPriceInfo)
  pricing: OrderPriceInfo;

  @Field(() => OrderPaymentInfo)
  payment: OrderPaymentInfo;

  @Field(() => [TableOrderItemObj])
  items: TableOrderItemObj[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class TableOrderObj implements TableOrder {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field(() => TableOrderStatuses)
  status: TableOrderStatuses;

  @Field(() => TableInfo)
  table: TableInfo;

  @Field(() => OrderPriceInfo)
  pricing: OrderPriceInfo;

  @Field(() => OrderPaymentInfo)
  payment: OrderPaymentInfo;

  @Field(() => [String])
  tabIds: Types.ObjectId[];

  @Field(() => [OrderTabObj], { nullable: true })
  tabs?: OrderTabObj[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
