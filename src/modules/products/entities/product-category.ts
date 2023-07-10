import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductCategoryDocument = ProductCategory & Document;

@Schema({ timestamps: true })
export class ProductCategory {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  productId: string;

  @Prop()
  categoryId: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
