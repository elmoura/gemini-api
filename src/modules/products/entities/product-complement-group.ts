import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProductComplementGroup {
  @Prop()
  complementGroupId: string;

  @Prop()
  label: string;
}

export const ProductComplementGroupSchema = SchemaFactory.createForClass(
  ProductComplementGroup,
);
