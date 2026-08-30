import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsEnum, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { OrganizationRole } from '../../enums/organization-role';

@InputType()
export class UpdateUserRolesInput {
  @Field()
  @Validate(IsObjectId)
  userId: string;

  @Field(() => [OrganizationRole])
  @ArrayNotEmpty()
  @IsEnum(OrganizationRole, { each: true })
  roles: OrganizationRole[];
}
