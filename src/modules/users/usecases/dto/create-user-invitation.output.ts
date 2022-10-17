import { Field, ObjectType } from '@nestjs/graphql';
import { IUserForInvitation } from '../../entities/user-for-invitation';
import { AccountStatuses } from '../../enums/account-confirmation-statuses';

@ObjectType()
export class CreateUserInvitationOutput implements IUserForInvitation {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  email: string;

  @Field()
  accountStatus: AccountStatuses;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
