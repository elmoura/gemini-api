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

  /**
   * @todo
   * atualmente não existe um fluxo de inserção das locations,
   * temos que criar isso depois;
   */
  locations?: any[];

  createdAt: Date;

  updatedAt: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
