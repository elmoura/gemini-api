import { Field, InputType } from '@nestjs/graphql';
import { Product } from '@modules/products/entities/product';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class UpdateProductInput implements Partial<Product> {
  @Field()
  @Validate(IsObjectId)
  _id: string;

  organizationId: string;

  @Field({ nullable: true })
  @IsOptional()
  @Validate(IsObjectId)
  categoryId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  originalPrice?: number;

  @Field({ nullable: true })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  promotionalPrice?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPromotionalPriceEnabled?: boolean;
}
