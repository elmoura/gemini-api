import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ComplementSelectionType } from '../enums/complement-selection-type';

export type ComplementGroupDocument = ComplementGroup & Document;

@Schema({ timestamps: true })
export class ComplementGroup {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  name: string;

  @Prop({ default: 0 })
  minSelections: number;

  @Prop({ default: 1 })
  maxSelections: number;

  @Prop({
    type: String,
    enum: ComplementSelectionType,
    default: ComplementSelectionType.MULTIPLE,
  })
  selectionType: ComplementSelectionType;

  createdAt: Date;

  updatedAt: Date;
}

export const ComplementGroupSchema =
  SchemaFactory.createForClass(ComplementGroup);
