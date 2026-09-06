import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaymentMethods } from '@shared/enums/payment-methods';
import {
  CashRegister,
  CashRegisterPaymentMethodTotal,
  CashRegisterPaymentSummary,
  CashRegisterStatus,
} from '../../entities/cash-register';

@ObjectType()
export class CashRegisterPaymentMethodTotalObj
  implements CashRegisterPaymentMethodTotal
{
  @Field(() => PaymentMethods)
  method: PaymentMethods;

  @Field()
  total: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class CashRegisterPaymentSummaryObj
  implements CashRegisterPaymentSummary
{
  /** ENTRA na conferência de fechamento (ADR-4). */
  @Field()
  totalCashPayments: number;

  /** Informativo — nunca entra na conferência. */
  @Field()
  totalNonCashPayments: number;

  /** Informativo — quebrado por método efetivamente usado. */
  @Field(() => [CashRegisterPaymentMethodTotalObj])
  byMethod: CashRegisterPaymentMethodTotalObj[];

  @Field(() => Int)
  paymentsCount: number;
}

/**
 * `summary` é calculado ao vivo quando o caixa está OPEN e vem de
 * `closingSummary` quando CLOSED — o front consome o mesmo campo nos dois
 * casos e não precisa saber a diferença (ADR-3).
 */
@ObjectType()
export class CashRegisterObj implements Omit<CashRegister, 'closingSummary'> {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field(() => CashRegisterStatus)
  status: CashRegisterStatus;

  @Field()
  openedByUserId: string;

  @Field()
  openingAmount: number;

  @Field({ nullable: true })
  closedByUserId?: string;

  @Field({ nullable: true })
  closingAmount?: number;

  @Field({ nullable: true })
  expectedClosingAmount?: number;

  @Field({ nullable: true })
  difference?: number;

  @Field(() => CashRegisterPaymentSummaryObj)
  summary: CashRegisterPaymentSummaryObj;

  @Field()
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  finishedAt: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
