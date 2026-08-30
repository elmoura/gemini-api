import { Field, ObjectType } from '@nestjs/graphql';
import { Invitation, InvitationStatus } from '../../entities/invitation';
import { OrganizationRole } from '../../enums/organization-role';

@ObjectType()
export class InvitationObject
  implements
    Pick<
      Invitation,
      | '_id'
      | 'email'
      | 'roles'
      | 'status'
      | 'expiresAt'
      | 'invitedByUserId'
      | 'createdAt'
    >
{
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field(() => [OrganizationRole])
  roles: OrganizationRole[];

  @Field(() => InvitationStatus)
  status: InvitationStatus;

  @Field()
  expiresAt: Date;

  @Field({ nullable: true })
  invitedByUserId?: string;

  @Field()
  createdAt: Date;
}
