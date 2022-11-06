import { Field, ObjectType } from '@nestjs/graphql';
import { AccountStatuses } from '@modules/users/enums/account-confirmation-statuses';

@ObjectType()
export class AccountConfirmationOutput {
  @Field()
  _id: string;

  @Field()
  accountStatus: AccountStatuses;
}
