import { Product } from '@modules/products/entities/product';
import { Field, ObjectType } from '@nestjs/graphql';
import { InsertProductCategoryOutput } from './insert-product-category.output';

@ObjectType('Product')
export class ProductObj implements Product {
  @Field()
  _id: string;

  organizationId: string;

  @Field()
  isActive: boolean;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  originalPrice: number;

  @Field({ nullable: true })
  promotionalPrice?: number;

  // @Field(() => InsertProductCategoryOutput)
  categories?: Partial<InsertProductCategoryOutput>[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
