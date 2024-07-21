import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Validate } from 'class-validator';

@InputType()
export class GetMenuInput {
  @Field()
  @Validate(IsObjectId)
  organizationId: string;
}
