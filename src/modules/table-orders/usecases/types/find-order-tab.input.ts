import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class FindTableOrderInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;
}

@InputType()
export class FindOrderTabInput {
  @Field()
  @Validate(IsObjectId)
  orderTabId: string;
}

@InputType()
export class ListOrderTabsInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;
}
