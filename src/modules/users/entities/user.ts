import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { IUserForInvitation } from './user-for-invitation';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User implements IUserForInvitation {
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

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
