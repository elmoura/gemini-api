import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TableOrderItemInput {
  @Field()
  productId: string;

  @Field()
  quantity: number;

  // aditionals
}

@InputType()
export class CreateTableOrderInput {
  @Field()
  tableId: string;

  @Field(() => TableOrderItemInput)
  items: TableOrderItemInput[];
}
