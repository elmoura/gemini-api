import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  productIds: ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
