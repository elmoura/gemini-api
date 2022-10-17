import { Field, InputType } from '@nestjs/graphql';
import { IUserInvitationData } from '@modules/users/datasources/user.datasource';

@InputType()
export class CreateUserInvitationInput implements IUserInvitationData {
  @Field()
  organizationId: string;

  @Field()
  email: string;
}
