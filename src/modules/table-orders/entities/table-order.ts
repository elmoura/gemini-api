import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TableOrderItem, TableOrderItemSchema } from './table-order-item';
import { Document } from 'mongoose';
import { Table } from '../../table/entities/table';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';
import { PaymentMethods } from '@shared/enums/payment-methods';

export type TableOrderDocument = TableOrder & Document;

export class TableOrderPricing {
  total: number;
  fees: number;
  discount: number;
}

export class TableOrderPayment {
  total: number;
  paidAmount: number;
  paymentStatus: TableOrderPaymentStatuses;
  method?: PaymentMethods;
  instalments?: number;
}

class TableInfo implements Pick<Table, '_id' | 'identifier'> {
  _id: string;

  identifier: string;
}

@Schema({ timestamps: true })
export class TableOrder {
  _id: string;

  @Prop({ type: TableInfo })
  table: TableInfo;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  status: TableOrderStatuses;

  @Prop({ type: TableOrderPricing })
  pricing: TableOrderPricing;

  @Prop({ type: TableOrderPayment })
  payment: TableOrderPayment;

  @Prop({ type: [TableOrderItemSchema] })
  items: TableOrderItem[];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
