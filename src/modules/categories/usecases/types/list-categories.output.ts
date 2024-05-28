import { Field, ObjectType } from '@nestjs/graphql';
import { ListOutput } from '@shared/interfaces/list-output';
import { Category } from '@modules/categories/entities/category';
import { CategoryObj } from './category.object';

@ObjectType()
export class ListCategoriesOutput implements ListOutput<Category> {
  @Field()
  count: number;

  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field(() => [CategoryObj])
  data: Category[];
}
