import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  _id: string;

  @Prop()
  organizationId: string;

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

  @Prop()
  categoryId?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
