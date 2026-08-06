import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';

@InputType()
export class UpdateComplementInput {
  organizationId: string;
  locationId: string;

  @Field()
  @Validate(IsObjectId)
  _id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  additionalPrice?: number;

  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;

  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  minQuantity?: number;

  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxQuantity?: number;
}
