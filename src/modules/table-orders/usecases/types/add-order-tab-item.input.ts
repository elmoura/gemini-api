import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, Validate, ValidateNested } from 'class-validator';
import { TableOrderItemInput } from './table-order-item.input';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class AddOrderTabItemInput {
  organizationId: string;

  locationId?: string;

  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableOrderItemInput)
  @Field(() => [TableOrderItemInput])
  items: TableOrderItemInput[];
}

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
