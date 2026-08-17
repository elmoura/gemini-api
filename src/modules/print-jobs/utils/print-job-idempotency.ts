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

export function buildItemUpdatedIdempotencyKey(
  orderTabId: string,
  itemId: string,
  changeId: string,
): string {
  return `${orderTabId}:${itemId}:${changeId}:${PrintJobTrigger.ITEM_UPDATED}`;
}

export function buildItemRemovedIdempotencyKey(
  orderTabId: string,
  itemId: string,
  changeId: string,
): string {
  return `${orderTabId}:${itemId}:${changeId}:${PrintJobTrigger.ITEM_REMOVED}`;
}
