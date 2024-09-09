import { Category } from '@modules/categories/entities/category';
import { Field, InputType } from '@nestjs/graphql';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';
import { IsObjectId } from '@shared/validations/is-object-id';
import { IsArray, IsOptional, IsString, Validate } from 'class-validator';

@InputType()
export class UpdateCategoryInput
  implements Partial<Omit<Category, AutoGeneratedFields | 'productIds'>>
{
  @Field()
  @Validate(IsObjectId)
  _id: string;

  locationId?: string;

  organizationId: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsArray()
  @IsOptional()
  @Field(() => [String], { nullable: true })
  @Validate(IsObjectId, { each: true })
  productsToAdd?: string[];

  @IsArray()
  @IsOptional()
  @Field(() => [String], { nullable: true })
  @Validate(IsObjectId, { each: true })
  productsToRemove?: string[];
}
