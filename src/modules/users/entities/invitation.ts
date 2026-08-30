import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { registerEnumType } from '@nestjs/graphql';
import { OrganizationRole } from '../enums/organization-role';

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(InvitationStatus, { name: 'InvitationStatus' });

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  _id: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: [String], enum: OrganizationRole, required: true })
  roles: OrganizationRole[];

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({
    required: true,
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  invitedByUserId?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

InvitationSchema.index({ organizationId: 1, email: 1, status: 1 });
