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

  // horario de funcionamento

  // cor primaria

  // cor secundaria

  // logoUrl

  // taxas de entregas: array com raios de km e precificação

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
