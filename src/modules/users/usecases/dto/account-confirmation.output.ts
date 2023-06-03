import { Field, ObjectType } from '@nestjs/graphql';
import { AccountStatuses } from '@modules/users/enums/account-confirmation-statuses';
import { User } from '@modules/users/entities/user';

@ObjectType()
export class AccountConfirmationOutput implements Omit<User, 'password'> {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  accountStatus: AccountStatuses;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
