import {
  buildBatchAddedIdempotencyKey,
  buildOrderTabPaidIdempotencyKey,
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
});
