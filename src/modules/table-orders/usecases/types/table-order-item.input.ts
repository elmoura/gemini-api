import { Field, InputType } from '@nestjs/graphql';
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
import { Type } from 'class-transformer';

@InputType()
export class TableOrderItemComplementInput {
  @Field()
  @Validate(IsObjectId)
  complementId: string;

  @Field()
  @IsInt()
  @Min(1)
  quantity: number;
}

@InputType()
export class TableOrderItemInput {
  @Field()
  @Validate(IsObjectId)
  productId: string;

  @Field()
  @IsInt()
  quantity: number;

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
