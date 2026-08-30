import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class CancelInvitationInput {
  @Field()
  @Validate(IsObjectId)
  invitationId: string;
}
