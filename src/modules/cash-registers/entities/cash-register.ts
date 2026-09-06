import { registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentMethods } from '@shared/enums/payment-methods';

export type CashRegisterDocument = CashRegister & Document;

export enum CashRegisterStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

registerEnumType(CashRegisterStatus, { name: 'CashRegisterStatus' });

/** Total apurado por método de pagamento — informativo, exceto dinheiro. */
export class CashRegisterPaymentMethodTotal {
  method: PaymentMethods;

  total: number;

  count: number;
}

/**
 * Resumo de entradas do caixa. `totalCashPayments` é o único campo
 * load-bearing: é o que entra na conferência de fechamento (ADR-4).
 * `totalNonCashPayments` e `byMethod` são exclusivamente informativos.
 */
export class CashRegisterPaymentSummary {
  totalCashPayments: number;

  totalNonCashPayments: number;

  byMethod: CashRegisterPaymentMethodTotal[];

  paymentsCount: number;
}

@Schema({ timestamps: true })
export class CashRegister {
  _id: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop({
    required: true,
    enum: CashRegisterStatus,
    default: CashRegisterStatus.OPEN,
  })
  status: CashRegisterStatus;

  @Prop({ required: true })
  openedByUserId: string;

  /** Fundo inicial (troco) colocado na gaveta na abertura. */
  @Prop({ required: true })
  openingAmount: number;

  @Prop()
  closedByUserId?: string;

  /** Valor em dinheiro efetivamente contado pelo operador no fechamento. */
  @Prop()
  closingAmount?: number;

  /** Calculado no fechamento — ver ADR-4 (só dinheiro entra na fórmula). */
  @Prop()
  expectedClosingAmount?: number;

  /** closingAmount - expectedClosingAmount (> 0 sobra, < 0 falta). */
  @Prop()
  difference?: number;

  /** Snapshot congelado no fechamento — ver ADR-3. */
  @Prop({ type: CashRegisterPaymentSummary })
  closingSummary?: CashRegisterPaymentSummary;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ type: Date, default: null })
  finishedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export const CashRegisterSchema = SchemaFactory.createForClass(CashRegister);

CashRegisterSchema.index({ organizationId: 1, locationId: 1, status: 1 });
CashRegisterSchema.index({ organizationId: 1, locationId: 1, startedAt: -1 });
