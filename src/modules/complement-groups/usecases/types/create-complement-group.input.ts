import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ComplementSelectionType } from '../../enums/complement-selection-type';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

registerEnumType(ComplementSelectionType, {
  name: 'ComplementSelectionType',
});

@InputType()
export class CreateComplementGroupInput {
  organizationId: string;
  locationId: string;

  @Field()
  @IsString()
  name: string;

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
