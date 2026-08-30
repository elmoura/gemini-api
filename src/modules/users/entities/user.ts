import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { ThemePreference } from '../enums/theme-preference';
import { OrganizationRole } from '../enums/organization-role';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop()
  organizationId: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  accountStatus: AccountStatuses;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ enum: ThemePreference, default: ThemePreference.SYSTEM })
  themePreference: ThemePreference;

  @Prop({ type: [String], enum: OrganizationRole, default: [] })
  roles: OrganizationRole[];

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
