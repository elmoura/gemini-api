import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { IsInt, IsOptional, Validate } from 'class-validator';

@InputType()
export class RemoveTableOrderItemInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @Field()
  @Validate(IsObjectId)
  itemId: string;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  quantity?: number;

  organizationId: string;
}
