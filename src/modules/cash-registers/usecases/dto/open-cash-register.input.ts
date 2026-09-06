import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';

@InputType()
export class OpenCashRegisterInput {
  /** Fundo inicial (troco) colocado na gaveta. */
  @Field()
  @IsNumber()
  @Min(0)
  openingAmount: number;
}
