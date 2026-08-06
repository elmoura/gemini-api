import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ComplementDocument = Complement & Document;

@Schema({ timestamps: true })
export class Complement {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  complementGroupId: string;

  @Prop()
  name: string;

  @Prop({ default: 0 })
  additionalPrice: number;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop({ default: 0 })
  minQuantity: number;

  @Prop({ default: 1 })
  maxQuantity: number;

  createdAt: Date;

  updatedAt: Date;
}

export const ComplementSchema = SchemaFactory.createForClass(Complement);
