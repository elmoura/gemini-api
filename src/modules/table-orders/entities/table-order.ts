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
 * `@Schema()` próprio (não só uma classe TS) porque esta classe é usada como
 * elemento de array tanto em `OrderTab.payments[]` quanto em
 * `TableOrder.payments[]` — Mongoose exige um schema de verdade para
 * subdocumentos dentro de array. Ganha `_id` implícito de subdocumento
 * (default do Mongoose).
 */
@Schema()
export class TableOrderPayment {
  @Prop()
  total: number;

  @Prop()
  paidAmount: number;

  /**
   * Só é significativo no elemento único de `TableOrder.payments[]`
   * (consolidado, derivado de todas as tabs). Em `OrderTab.payments[]`
   * (multi-pagamento) cada elemento é uma transação isolada — o status
   * agregado da comanda mora em `OrderTab.paymentStatus`, não aqui.
   */
  @Prop()
  paymentStatus?: TableOrderPaymentStatuses;

  @Prop()
  method?: PaymentMethods;

  @Prop()
  instalments?: number;

  /**
   * Só significativo quando `method === CASH`: valor em espécie entregue
   * pelo cliente. O troco (`receivedAmount - paidAmount`) é derivado, nunca
   * persistido — a apuração de caixa (ADR-4) soma sempre `paidAmount`
   * (valor da venda), nunca este campo.
   */
  @Prop()
  receivedAmount?: number;

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

  @Prop({ type: [TableOrderPaymentSchema], default: [] })
  payments: TableOrderPayment[];

  @Prop({ type: [String], default: [] })
  tabIds: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}

export const TableOrderSchema = SchemaFactory.createForClass(TableOrder);
