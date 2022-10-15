import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AccountStatuses } from '../enums/account-confirmation-statuses';

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

  createdAt: string;

  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
