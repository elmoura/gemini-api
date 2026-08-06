import { Field, InputType } from '@nestjs/graphql';
import { TableOrderPayment } from '@modules/table-orders/entities/table-order';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { TableOrderPaymentStatuses } from '@modules/table-orders/enums/table-order-statuses';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Type } from 'class-transformer';

@InputType()
export class TableOrderPaymentInput
  implements
    Pick<TableOrderPayment, 'instalments' | 'method' | 'paymentStatus'>
{
  @Field()
  @IsNumber()
  instalments: number;

  @Field(() => PaymentMethods)
  @IsEnum(PaymentMethods)
  method: PaymentMethods;

  @Field(() => TableOrderPaymentStatuses)
  @IsEnum(TableOrderPaymentStatuses)
  paymentStatus: TableOrderPaymentStatuses;
}

@InputType()
export class FinishOrderTabInput {
  organizationId: string;

  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @Field()
  @IsBoolean()
  payServiceTax: boolean;

  @ValidateNested()
  @Type(() => TableOrderPaymentInput)
  @Field(() => TableOrderPaymentInput)
  payment: TableOrderPaymentInput;
}

@InputType()
export class FinishTableOrderInput {
  organizationId: string;

  @Field()
  @Validate(IsObjectId)
  tableOrderId: string;
}
