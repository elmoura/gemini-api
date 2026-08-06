import { BatchAffectedItem } from './compute-batch-affected-items';

export type KitchenBatchPayload = {
  template: 'KITCHEN_BATCH';
  paperWidthMm: 58 | 80;
  header: {
    locationName: string;
    tableIdentifier: string;
    orderTabSequence: number;
    batchId: string;
    printedAt: string;
  };
  items: BatchAffectedItem[];
  footer: {
    operatorName?: string;
  };
};

export function buildKitchenBatchPayload(params: {
  paperWidthMm: 58 | 80;
  locationName: string;
  tableIdentifier: string;
  orderTabSequence: number;
  batchId: string;
  items: BatchAffectedItem[];
  operatorName?: string;
}): KitchenBatchPayload {
  return {
    template: 'KITCHEN_BATCH',
    paperWidthMm: params.paperWidthMm,
    header: {
      locationName: params.locationName,
      tableIdentifier: params.tableIdentifier,
      orderTabSequence: params.orderTabSequence,
      batchId: params.batchId,
      printedAt: new Date().toISOString(),
    },
    items: params.items,
    footer: {
      operatorName: params.operatorName,
    },
  };
}
