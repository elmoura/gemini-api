import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Validate } from 'class-validator';

@InputType()
export class RemoveTableOrderItemInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @Field()
  @Validate(IsObjectId)
  itemId: string;

  organizationId: string;
}
