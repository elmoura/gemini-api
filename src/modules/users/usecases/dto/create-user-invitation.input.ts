import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { IUserInvitationData } from '@modules/users/datasources/user.datasource';
import { IOrganizationData } from '@shared/interfaces/organization-data';

@InputType()
export class CreateUserInvitationInput
  implements Omit<IUserInvitationData, keyof IOrganizationData>
{
  @Field()
  @IsEmail()
  email: string;
}
