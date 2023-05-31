import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrganizationLocation } from './organization-location';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  businessSegment: string;

  @Prop()
  businessRepresentantId?: string;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: OrganizationLocation.name },
    ],
  })
  locations?: OrganizationLocation[];

  createdAt: Date;

  updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
