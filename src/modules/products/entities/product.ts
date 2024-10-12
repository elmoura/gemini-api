import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ProductImage {
  _id?: string;

  // @Prop()
  // index: number;

  @Prop()
  url: string;

  createdAt?: string;

  updatedAt?: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  identifier?: string;

  @Prop()
  isActive: boolean;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isPromotionalPriceEnabled?: boolean;

  @Prop()
  originalPrice: number;

  @Prop()
  promotionalPrice?: number;

  @Prop({ type: [ProductImageSchema] })
  images: ProductImage[];

  createdAt: Date;

  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
