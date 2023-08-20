import { Table } from '@modules/table/entities/table';
import {
  TableOrderPricing,
  TableOrderPayment,
  TableOrder,
} from '@modules/table/entities/table-order';
import { TableOrderItem } from '@modules/table/entities/table-order-item';
import {
  TableOrderStatuses,
  TableOrderPaymentStatuses,
} from '@modules/table/enums/table-order-statuses';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethods } from '@shared/enums/payment-methods';

@ObjectType()
class OrderPriceInfo implements TableOrderPricing {
  @Field()
  total: number;

  @Field()
  fees: number;

  @Field()
  discount: number;
}

@ObjectType()
class OrderPaymentInfo implements TableOrderPayment {
  @Field()
  total: number;

  @Field()
  paidAmount: number;

  @Field(() => TableOrderPaymentStatuses)
  paymentStatus: TableOrderPaymentStatuses;

  @Field(() => PaymentMethods)
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
class TableOrderItemObj implements TableOrderItem {
  @Field()
  quantity: number;

  @Field()
  productId: string;

  @Field()
  discount: number;

  @Field()
  productPrice: number;

  @Field()
  total: number;
}

registerEnumType(TableOrderStatuses, { name: 'TableOrderStatuses' });

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

  @Field(() => TableOrderItemObj)
  items: TableOrderItemObj[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
