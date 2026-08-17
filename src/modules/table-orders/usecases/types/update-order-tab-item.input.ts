import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { TableOrderItemComplementInput } from './table-order-item.input';
import { ClientSourceData } from '@modules/print-jobs/decorators/client-source.decorator';

@InputType()
export class UpdateOrderTabItemInput {
  organizationId: string;
  locationId: string;

  source?: ClientSourceData;

  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @Field()
  @Validate(IsObjectId)
  itemId: string;

  @Field({ nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  observation?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TableOrderItemComplementInput)
  @Field(() => [TableOrderItemComplementInput], { nullable: true })
  complements?: TableOrderItemComplementInput[];
}
