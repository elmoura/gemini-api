import { Field, ObjectType } from '@nestjs/graphql';

import { ListOutput } from '@shared/interfaces/list-output';
import { CategoryObj } from './category.object';

@ObjectType()
export class SearchCategoryResultObject implements ListOutput<CategoryObj> {
  @Field()
  count: number;

  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field(() => [CategoryObj])
  data: CategoryObj[];
}
