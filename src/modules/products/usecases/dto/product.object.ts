import { Product } from '@modules/products/entities/product';
import { Field, ObjectType } from '@nestjs/graphql';

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

  @Field({ nullable: true })
  isPromotionalPriceEnabled?: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
