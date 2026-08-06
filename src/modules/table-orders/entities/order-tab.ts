import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TableOrderItem, TableOrderItemSchema } from './table-order-item';
import { TableOrderPayment, TableOrderPricing } from './table-order';
import { OrderTabStatuses } from '../enums/order-tab-statuses';

export type OrderTabDocument = OrderTab & Document;

@Schema({ timestamps: true })
export class OrderTab {
  _id: string;

  @Prop()
  tableOrderId: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  sequence: number;

  @Prop({ default: OrderTabStatuses.IN_ATTENDANCE })
  status: OrderTabStatuses;

  @Prop({ type: TableOrderPricing })
  pricing: TableOrderPricing;

  @Prop({ type: TableOrderPayment })
  payment: TableOrderPayment;

  @Prop({ type: [TableOrderItemSchema], default: [] })
  items: TableOrderItem[];

  createdAt: Date;

  updatedAt: Date;
}

export const OrderTabSchema = SchemaFactory.createForClass(OrderTab);
