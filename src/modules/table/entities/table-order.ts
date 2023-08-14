import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TableOrderItem } from './table-order-item';
import { Document } from 'mongoose';
import { Table } from './table';

export type TableOrderDocument = TableOrder & Document;

export enum TableOrderStatuses {
  IN_ATTENDANCE = 'em atendimento',
  FINISHED = 'finalizado',
}

@Schema()
export class TableOrder {
  _id: string;

  @Prop()
  table: Pick<Table, '_id' | 'identifier'>;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  status: TableOrderStatuses;

  @Prop()
  items: TableOrderItem[];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
