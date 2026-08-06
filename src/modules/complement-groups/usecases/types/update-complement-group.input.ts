import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { ComplementSelectionType } from '../../enums/complement-selection-type';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';

@InputType()
export class UpdateComplementGroupInput {
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
  @IsInt()
  @Min(0)
  @IsOptional()
  minSelections?: number;

  @Field({ nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  maxSelections?: number;

  @Field(() => ComplementSelectionType, { nullable: true })
  @IsEnum(ComplementSelectionType)
  @IsOptional()
  selectionType?: ComplementSelectionType;
}
