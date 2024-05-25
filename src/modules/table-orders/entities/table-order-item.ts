import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TableOrderItem {
  _id: string;

  @Prop()
  quantity: number;

  @Prop()
  productId: string;

  @Prop()
  discount: number;

  @Prop()
  productPrice: number;

  @Prop()
  total: number;

  @Prop()
  observation?: string;

  // productAdditionals?: [];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderItemSchema =
  SchemaFactory.createForClass(TableOrderItem);
