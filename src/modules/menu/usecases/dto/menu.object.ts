import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryObj } from '@modules/categories/usecases/types/category.object';
import { ProductObj } from '@modules/products/usecases/dto/product.object';

@ObjectType()
class CategoriesWithProducts extends CategoryObj {
  @Field(() => [ProductObj])
  products: ProductObj[];
}

@ObjectType()
export class MenuObj {
  @Field(() => [CategoriesWithProducts])
  categories: CategoriesWithProducts[];
}
