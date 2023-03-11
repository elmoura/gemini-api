import { User } from '@modules/users/entities/user';
import { AccountStatuses } from '@modules/users/enums/account-confirmation-statuses';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class UserAuthData {
  @Field()
  accessToken: string;
}

@ObjectType()
export class LoginUserOutput implements Omit<User, 'password'> {
  @Field()
  _id: string;

  @Field(() => UserAuthData)
  auth: UserAuthData;

  @Field()
  organizationId: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  accountStatus: AccountStatuses;

  @Field()
  email: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
