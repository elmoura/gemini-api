import { TableOrderStatuses } from '@modules/table-orders/enums/table-order-statuses';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetOrderStatusInput {
  @Field()
  orderId: string;

  @Field()
  status: TableOrderStatuses;
}
