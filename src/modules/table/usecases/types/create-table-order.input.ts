import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsInt, Validate, ValidateNested } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Type } from 'class-transformer';

@InputType()
export class TableOrderItemInput {
  @Field()
  @Validate(IsObjectId)
  productId: string;

  @Field()
  @IsInt()
  quantity: number;

  // aditionals
}

@InputType()
export class CreateTableOrderInput {
  @Field()
  @Validate(IsObjectId)
  tableId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableOrderItemInput)
  @Field(() => [TableOrderItemInput])
  items: TableOrderItemInput[];
}
