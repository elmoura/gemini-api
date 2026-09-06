import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class CloseCashRegisterInput {
  /** Valor em dinheiro efetivamente contado na gaveta. */
  @Field()
  @IsNumber()
  @Min(0)
  closingAmount: number;
}
