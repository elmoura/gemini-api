import { registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashMovementDocument = CashMovement & Document;

export enum CashMovementType {
  /** Sangria — retirada de dinheiro da gaveta. */
  WITHDRAWAL = 'WITHDRAWAL',
  /** Suprimento — reforço de troco na gaveta. */
  SUPPLY = 'SUPPLY',
}

registerEnumType(CashMovementType, { name: 'CashMovementType' });

/**
 * Movimentação MANUAL de dinheiro na gaveta. Pagamento de comanda NÃO vira
 * `CashMovement` — ver ADR-2 (evitar escrita dupla sem transação).
 */
@Schema({ timestamps: true })
export class CashMovement {
  _id: string;

  @Prop({ required: true })
  cashRegisterId: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true, enum: CashMovementType })
  type: CashMovementType;

  @Prop({ required: true })
  amount: number;

  @Prop()
  reason?: string;

  @Prop({ required: true })
  registeredByUserId: string;

  createdAt: Date;

  updatedAt: Date;
}

export const CashMovementSchema = SchemaFactory.createForClass(CashMovement);

CashMovementSchema.index({ cashRegisterId: 1, createdAt: -1 });
