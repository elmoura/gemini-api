import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LocationShiftStatuses } from '../enums/location-shift-statuses';

export type LocationShiftDocument = LocationShift & Document;

@Schema({ timestamps: true })
export class LocationShift {
  _id: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true, enum: LocationShiftStatuses })
  status: LocationShiftStatuses;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  finishedAt: Date | null;

  @Prop({ default: 0 })
  currentTableOrderQuantity: number;

  @Prop({ default: 0 })
  currentOrderTabsQuantity: number;

  createdAt: Date;

  updatedAt: Date;
}

export const LocationShiftSchema = SchemaFactory.createForClass(LocationShift);

LocationShiftSchema.index({ organizationId: 1, locationId: 1, status: 1 });
LocationShiftSchema.index({ organizationId: 1, locationId: 1, startedAt: -1 });
