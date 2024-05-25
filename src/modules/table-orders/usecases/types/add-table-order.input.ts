import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, Validate, ValidateNested } from 'class-validator';
import { TableOrderItemInput } from './create-table-order.input';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class AddTableOrderItemInput {
  organizationId: string;

  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableOrderItemInput)
  @Field(() => [TableOrderItemInput])
  items: TableOrderItemInput[];
}
