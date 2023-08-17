import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductImageDocument = ProductImage & Document;

@Schema({ timestamps: true })
export class ProductImage {
  _id: string;

  @Prop()
  productId: string;

  @Prop()
  fileName: string;

  @Prop()
  url: string;

  createdAt: string;

  updatedAt: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);
