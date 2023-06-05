import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '@modules/categories/entities/category';

@ObjectType('Category')
export class CategoryObj implements Omit<Category, 'organizationId'> {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  organizationId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
