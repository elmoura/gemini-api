import { Field, InputType } from '@nestjs/graphql';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';
import { ProductCategory } from '@modules/products/entities/product-category';

@InputType()
export class InsertProductCategoryInput
  implements Omit<ProductCategory, AutoGeneratedFields | 'organizationId'>
{
  @Field()
  categoryId: string;

  @Field()
  productId: string;
}