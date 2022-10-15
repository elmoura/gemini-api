import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  createdAt: Date;

  updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
