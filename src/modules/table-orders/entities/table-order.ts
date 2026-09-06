import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Table } from '../../table/entities/table';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';
import { PaymentMethods } from '@shared/enums/payment-methods';

export type TableOrderDocument = TableOrder & Document;

export class TableOrderPricing {
  total: number;
  fees: number;
  discount: number;
}

/**
 * `@Schema()` próprio (não só uma classe TS) porque B2 passa a usar esta
 * classe também como elemento de array (`OrderTab.payments[]`) — Mongoose
 * exige um schema de verdade para subdocumentos dentro de array, ao
 * contrário do embutido singular (`TableOrder.payment`), que aceita a classe
 * "crua". Ganha `_id` implícito de subdocumento (default do Mongoose).
 */
@Schema()
export class TableOrderPayment {
  @Prop()
  total: number;

  @Prop()
  paidAmount: number;

  /**
   * Só é significativo no `payment` consolidado de `TableOrder` (derivado de
   * todas as tabs). Em `OrderTab.payments[]` (B2/multi-pagamento) cada
   * elemento é uma transação isolada — o status agregado da comanda mora em
   * `OrderTab.paymentStatus`, não aqui.
   */
  @Prop()
  paymentStatus?: TableOrderPaymentStatuses;

  @Prop()
  method?: PaymentMethods;

  @Prop()
  instalments?: number;

  /**
   * Caixa ao qual este pagamento pertence (ADR-2). Só é carimbado em
   * `OrderTab` — o `TableOrderPayment` derivado em `TableOrder` NUNCA recebe
   * este campo, sob pena de dupla contagem na apuração de caixa.
   */
  @Prop()
  cashRegisterId?: string;

  /** Quando o pagamento foi efetivado. */
  @Prop()
  paidAt?: Date;
}

export const TableOrderPaymentSchema =
  SchemaFactory.createForClass(TableOrderPayment);

class TableInfo implements Pick<Table, '_id' | 'identifier'> {
  _id: string;

  identifier: string;
}

@Schema({ timestamps: true })
export class TableOrder {
  _id: string;

  @Prop({ type: TableInfo })
  table: TableInfo;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  status: TableOrderStatuses;

  @Prop({ type: TableOrderPricing })
  pricing: TableOrderPricing;

  @Prop({ type: TableOrderPaymentSchema })
  payment: TableOrderPayment;

  @Prop({ type: [String], default: [] })
  tabIds: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
