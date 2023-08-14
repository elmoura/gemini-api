import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TableDocument = Table & Document;

@Schema({ timestamps: true })
export class Table {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  identifier: string;

  createdAt: Date;

  updatedAt: Date;
}

export const TableSchema = SchemaFactory.createForClass(Table);
