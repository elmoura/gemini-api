import { Field, ObjectType } from '@nestjs/graphql';
import { TableOrderObj } from './table-order.object';

@ObjectType()
export class ListTableOrdersOutput {
  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field()
  ordersCount: number;

  @Field(() => [TableOrderObj])
  orders: TableOrderObj[];
}
