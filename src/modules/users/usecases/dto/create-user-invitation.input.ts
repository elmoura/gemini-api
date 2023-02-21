import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { IUserInvitationData } from '@modules/users/datasources/user.datasource';

@InputType()
export class CreateUserInvitationInput implements IUserInvitationData {
  @Field()
  @Validate(IsObjectId)
  organizationId: string;

  @Field()
  @IsEmail()
  email: string;
}
