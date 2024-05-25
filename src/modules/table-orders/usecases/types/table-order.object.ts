import { Table } from '@modules/table/entities/table';
import {
  TableOrderPricing,
  TableOrderPayment,
  TableOrder,
} from '@modules/table-orders/entities/table-order';
import { TableOrderItem } from '../../entities/table-order-item';
import {
  TableOrderStatuses,
  TableOrderPaymentStatuses,
} from '../../enums/table-order-statuses';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentMethods } from '@shared/enums/payment-methods';

@ObjectType()
class OrderPriceInfo implements TableOrderPricing {
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
class OrderPaymentInfo implements TableOrderPayment {
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
class TableOrderItemObj implements TableOrderItem {
  @Field()
  _id: string;

  @Field()
  quantity: number;

  @Field()
  productId: string;

  @Field()
  discount: number;

  @Field()
  productPrice: number;

  @Field({ nullable: true })
  observation?: string;

  @Field()
  total: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
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

  @Field(() => [TableOrderItemObj])
  items: TableOrderItemObj[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
