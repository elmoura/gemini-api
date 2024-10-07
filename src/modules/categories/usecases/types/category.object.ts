import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '@modules/categories/entities/category';

@ObjectType('Category')
export class CategoryObj
  implements Omit<Category, 'organizationId' | 'productIds'>
{
  @Field()
  _id: string;

  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  productIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
