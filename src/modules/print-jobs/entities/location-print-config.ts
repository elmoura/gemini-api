import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PrintStation } from '../enums/print-station';

export type LocationPrintConfigDocument = LocationPrintConfig & Document;

@Schema({ timestamps: true })
export class LocationPrintConfig {
  _id: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true, enum: PrintStation, default: PrintStation.KITCHEN })
  defaultStation: PrintStation;

  @Prop({ required: true, enum: [58, 80], default: 80 })
  defaultPaperWidthMm: 58 | 80;

  createdAt: Date;

  updatedAt: Date;
}

export const LocationPrintConfigSchema =
  SchemaFactory.createForClass(LocationPrintConfig);

LocationPrintConfigSchema.index({ organizationId: 1, locationId: 1 }, { unique: true });
