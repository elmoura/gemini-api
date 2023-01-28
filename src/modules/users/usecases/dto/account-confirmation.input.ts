import { User } from '@modules/users/entities/user';
import { Field, InputType } from '@nestjs/graphql';
import { IBaseCollection } from '@shared/interfaces/base-collection';

type AlreadySavedUserFields =
  | keyof IBaseCollection
  | 'accountStatus'
  | 'organizationId'
  | 'email';

@InputType()
export class AccountConfirmationInput
  implements Omit<User, AlreadySavedUserFields>
{
  @Field()
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  password: string;
}
