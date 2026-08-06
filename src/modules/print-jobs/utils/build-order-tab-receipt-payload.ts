import { TableOrderItem } from '@modules/table-orders/entities/table-order-item';
import { TableOrderPayment } from '@modules/table-orders/entities/table-order';
import { TableOrderPricing } from '@modules/table-orders/entities/table-order';

export type OrderTabReceiptPayload = {
  template: 'ORDER_TAB_RECEIPT';
  paperWidthMm: 58 | 80;
  header: {
    locationName: string;
    tableIdentifier: string;
    orderTabSequence: number;
    printedAt: string;
  };
  items: Array<{
    itemId: string;
    productName: string;
    quantity: number;
    observation?: string;
    complements: Array<{ name: string; quantity: number }>;
    lineTotal: number;
  }>;
  totals: {
    subtotal: number;
    discount: number;
    fees: number;
    total: number;
    paymentMethod?: string;
    paidAmount: number;
  };
  footer: {
    operatorName?: string;
  };
};

export function buildOrderTabReceiptPayload(params: {
  paperWidthMm: 58 | 80;
  locationName: string;
  tableIdentifier: string;
  orderTabSequence: number;
  items: TableOrderItem[];
  pricing: TableOrderPricing;
  payment: TableOrderPayment;
  operatorName?: string;
}): OrderTabReceiptPayload {
  return {
    template: 'ORDER_TAB_RECEIPT',
    paperWidthMm: params.paperWidthMm,
    header: {
      locationName: params.locationName,
      tableIdentifier: params.tableIdentifier,
      orderTabSequence: params.orderTabSequence,
      printedAt: new Date().toISOString(),
    },
    items: params.items.map((item) => ({
      itemId: item._id.toString(),
      productName: item.productName ?? 'Produto',
      quantity: item.quantity,
      observation: item.observation,
      complements: (item.complements ?? []).map((complement) => ({
        name: complement.name,
        quantity: complement.quantity,
      })),
      lineTotal: item.total,
    })),
    totals: {
      subtotal: params.pricing.total - params.pricing.fees + params.pricing.discount,
      discount: params.pricing.discount,
      fees: params.pricing.fees,
      total: params.pricing.total,
      paymentMethod: params.payment.method,
      paidAmount: params.payment.paidAmount,
    },
    footer: {
      operatorName: params.operatorName,
    },
  };
}
