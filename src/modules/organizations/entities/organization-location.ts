import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class OrganizationLocation {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  name?: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  street: string;

  @Prop()
  number: string;

  @Prop()
  complement?: string;

  @Prop()
  postalCode: string;

  createdAt: Date;

  updatedAt: Date;
}

export const OrganizationLocationSchema =
  SchemaFactory.createForClass(OrganizationLocation);
