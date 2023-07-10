import { Field, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from '@modules/products/entities/product-category';

@ObjectType()
export class InsertProductCategoryOutput implements ProductCategory {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  categoryId: string;

  @Field()
  productId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
