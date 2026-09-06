import { Field, ObjectType } from '@nestjs/graphql';
import { CashRegisterObj } from './cash-register.object';

@ObjectType()
export class ListCashRegistersOutput {
  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field()
  cashRegistersCount: number;

  @Field(() => [CashRegisterObj])
  cashRegisters: CashRegisterObj[];
}
