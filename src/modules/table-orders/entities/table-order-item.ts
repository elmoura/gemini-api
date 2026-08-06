import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class TableOrderItemComplement {
  @Prop()
  complementId: string;

  @Prop()
  complementGroupId: string;

  @Prop()
  name: string;

  @Prop()
  unitPrice: number;

  @Prop()
  quantity: number;
}

export const TableOrderItemComplementSchema = SchemaFactory.createForClass(
  TableOrderItemComplement,
);

@Schema({ timestamps: true })
export class TableOrderItem {
  _id: string;

  @Prop()
  quantity: number;

  @Prop()
  productId: string;

  @Prop()
  @Prop()
  productName?: string;

  @Prop()
  discount: number;

  @Prop()
  productPrice: number;

  @Prop()
  total: number;

  @Prop()
  observation?: string;

  @Prop({ type: [TableOrderItemComplementSchema], default: [] })
  complements?: TableOrderItemComplement[];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderItemSchema =
  SchemaFactory.createForClass(TableOrderItem);
