import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from '@modules/products/entities/product';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';

@InputType()
export class CreateProductInput
  implements Omit<Product, AutoGeneratedFields | 'categoryIds'>
{
  organizationId: string;

  @Field()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @Field()
  @IsBoolean()
  isActive: boolean;

  @Field()
  @IsNumber()
  originalPrice: number;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  promotionalPrice?: number;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isPromotionalPriceEnabled?: boolean;
}
