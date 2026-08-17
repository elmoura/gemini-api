import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, Validate, ValidateNested } from 'class-validator';
import { TableOrderItemInput } from './table-order-item.input';
import { IsObjectId } from '@shared/validations/is-object-id';
import { ClientSourceData } from '@modules/print-jobs/decorators/client-source.decorator';

@InputType()
export class CreateOrderTabInput {
  source?: ClientSourceData;

  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableOrderItemInput)
  @Field(() => [TableOrderItemInput])
  items: TableOrderItemInput[];
}
