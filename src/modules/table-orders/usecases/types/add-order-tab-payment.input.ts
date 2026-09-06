import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { PaymentMethods } from '@shared/enums/payment-methods';

@InputType()
export class AddOrderTabPaymentInput {
  organizationId: string;

  locationId?: string;

  @Field()
  @Validate(IsObjectId)
  orderTabId: string;

  @Field(() => PaymentMethods)
  @IsEnum(PaymentMethods)
  method: PaymentMethods;

  @Field()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  instalments?: number;
}
