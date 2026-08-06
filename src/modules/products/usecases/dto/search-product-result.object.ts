import { Field, ObjectType } from '@nestjs/graphql';

import { ListOutput } from '@shared/interfaces/list-output';
import { ProductObj } from './product.object';

@ObjectType()
export class SearchProductResultObject implements ListOutput<ProductObj> {
  @Field()
  count: number;

  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field(() => [ProductObj])
  data: ProductObj[];
}
