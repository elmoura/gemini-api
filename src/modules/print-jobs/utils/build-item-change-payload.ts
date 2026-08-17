export type ItemChangeTicketPayload = {
  template: 'ITEM_UPDATED' | 'ITEM_REMOVED';
  paperWidthMm: 58 | 80;
  header: {
    locationName: string;
    tableIdentifier: string;
    orderTabSequence: number;
    printedAt: string;
  };
  item: {
    itemId: string;
    productName: string;
    previousQuantity?: number;
    quantity: number;
    remainingQuantity?: number;
    observation?: string;
    complements: Array<{ name: string; quantity: number }>;
  };
  footer: {
    operatorName?: string;
  };
};

export function buildItemChangePayload(params: {
  changeType: 'UPDATED' | 'REMOVED';
  paperWidthMm: 58 | 80;
  locationName: string;
  tableIdentifier: string;
  orderTabSequence: number;
  item: {
    itemId: string;
    productName: string;
    observation?: string;
    complements: Array<{ name: string; quantity: number }>;
  };
  previousQuantity?: number;
  quantity: number;
  remainingQuantity?: number;
  operatorName?: string;
}): ItemChangeTicketPayload {
  return {
    template: params.changeType === 'UPDATED' ? 'ITEM_UPDATED' : 'ITEM_REMOVED',
    paperWidthMm: params.paperWidthMm,
    header: {
      locationName: params.locationName,
      tableIdentifier: params.tableIdentifier,
      orderTabSequence: params.orderTabSequence,
      printedAt: new Date().toISOString(),
    },
    item: {
      itemId: params.item.itemId,
      productName: params.item.productName,
      previousQuantity: params.previousQuantity,
      quantity: params.quantity,
      remainingQuantity: params.remainingQuantity,
      observation: params.item.observation,
      complements: params.item.complements,
    },
    footer: {
      operatorName: params.operatorName,
    },
  };
}
