import { Field, InputType } from '@nestjs/graphql';
import { TableOrderItemInput } from './create-table-order.input';
import { Validate, ValidateNested } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Type } from 'class-transformer';

@InputType()
export class AddTableOrderItemsInput {
  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @ValidateNested({ each: true })
  @Type(() => TableOrderItemInput)
  @Field(() => [TableOrderItemInput])
  items: TableOrderItemInput[];
}
