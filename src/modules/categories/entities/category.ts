import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  productIds: string[];

  createdAt: Date;

  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
