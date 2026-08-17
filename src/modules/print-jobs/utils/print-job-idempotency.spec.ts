import {
  buildBatchAddedIdempotencyKey,
  buildOrderTabPaidIdempotencyKey,
  buildItemUpdatedIdempotencyKey,
  buildItemRemovedIdempotencyKey,
} from './print-job-idempotency';
import { PrintJobTrigger } from '../enums/print-job-trigger';

describe('print-job-idempotency', () => {
  it('gera chave para lote de itens', () => {
    expect(buildBatchAddedIdempotencyKey('tab-1', 'batch-1')).toBe(
      `tab-1:batch-1:${PrintJobTrigger.ITEMS_BATCH_ADDED}`,
    );
  });

  it('gera chave para pagamento de comanda', () => {
    expect(buildOrderTabPaidIdempotencyKey('tab-1')).toBe(
      `tab-1:${PrintJobTrigger.ORDER_TAB_PAID}`,
    );
  });

  it('gera chave para atualização de item', () => {
    expect(buildItemUpdatedIdempotencyKey('tab-1', 'item-1', 'change-1')).toBe(
      `tab-1:item-1:change-1:${PrintJobTrigger.ITEM_UPDATED}`,
    );
  });

  it('gera chave para remoção de item', () => {
    expect(buildItemRemovedIdempotencyKey('tab-1', 'item-1', 'change-1')).toBe(
      `tab-1:item-1:change-1:${PrintJobTrigger.ITEM_REMOVED}`,
    );
  });
});
