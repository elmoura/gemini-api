import { Product, ProductImage } from '@modules/products/entities/product';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ProductImageObj implements ProductImage {
  @Field()
  _id?: string;

  @Field()
  url: string;

  @Field()
  createdAt?: string;

  @Field()
  updatedAt?: string;
}

@ObjectType('Product')
export class ProductObj implements Product {
  @Field()
  _id: string;

  organizationId: string;

  locationId: string;

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

  @Field({ nullable: true })
  isPromotionalPriceEnabled?: boolean;

  @Field({ nullable: true })
  identifier?: string;

  @Field(() => [ProductImageObj])
  images: ProductImageObj[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
