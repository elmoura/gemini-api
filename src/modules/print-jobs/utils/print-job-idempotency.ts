import { PrintJobTrigger } from '../enums/print-job-trigger';

export function buildBatchAddedIdempotencyKey(
  orderTabId: string,
  batchId: string,
): string {
  return `${orderTabId}:${batchId}:${PrintJobTrigger.ITEMS_BATCH_ADDED}`;
}

export function buildOrderTabPaidIdempotencyKey(orderTabId: string): string {
  return `${orderTabId}:${PrintJobTrigger.ORDER_TAB_PAID}`;
}
