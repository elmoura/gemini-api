import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TableOrderItem, TableOrderItemSchema } from './table-order-item';
import {
  TableOrderPayment,
  TableOrderPaymentSchema,
  TableOrderPricing,
} from './table-order';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';

export type OrderTabDocument = OrderTab & Document;

@Schema({ timestamps: true })
export class OrderTab {
  _id: string;

  @Prop()
  tableOrderId: string;

  @Prop()
  organizationId: string;

  @Prop()
  locationId: string;

  @Prop()
  sequence: number;

  @Prop({ default: OrderTabStatuses.IN_ATTENDANCE })
  status: OrderTabStatuses;

  @Prop({ type: TableOrderPricing })
  pricing: TableOrderPricing;

  /**
   * Multi-pagamento (B2): cada elemento é uma transação isolada, carimbada
   * com o `cashRegisterId` do caixa aberto no momento daquele pagamento —
   * permite pagamento parcial atravessar troca de caixa sem corromper a
   * apuração de nenhum dos dois (ver story-mãe, CASH-B04).
   */
  @Prop({ type: [TableOrderPaymentSchema], default: [] })
  payments: TableOrderPayment[];

  /**
   * Status agregado da comanda, recalculado a cada mutação que altera
   * `payments[]` ou `pricing.total` — ver `deriveOrderTabPaymentStatus`.
   * `default: []` em `payments` + este default resolvem estruturalmente o
   * acesso a pagamento indefinido em tabs que nunca tiveram pagamento.
   */
  @Prop({
    enum: TableOrderPaymentStatuses,
    default: TableOrderPaymentStatuses.PENDING,
  })
  paymentStatus: TableOrderPaymentStatuses;

  @Prop({ type: [TableOrderItemSchema], default: [] })
  items: TableOrderItem[];

  createdAt: Date;

  updatedAt: Date;
}

export const OrderTabSchema = SchemaFactory.createForClass(OrderTab);

// Apuração de caixa (cash-registers) filtra por organização + caixa.
OrderTabSchema.index({ organizationId: 1, 'payments.cashRegisterId': 1 });
