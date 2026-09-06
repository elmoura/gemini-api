import { buildKitchenBatchPayload } from './build-kitchen-batch-payload';
import { buildOrderTabReceiptPayload } from './build-order-tab-receipt-payload';
import { buildItemChangePayload } from './build-item-change-payload';

describe('print payload builders', () => {
  it('buildKitchenBatchPayload inclui somente itens do lote', () => {
    const payload = buildKitchenBatchPayload({
      paperWidthMm: 80,
      locationName: 'Centro',
      tableIdentifier: 'Mesa 5',
      orderTabSequence: 1,
      batchId: 'batch-abc',
      items: [
        {
          itemId: 'i1',
          productName: 'Burger',
          quantity: 2,
          complements: [],
        },
      ],
    });

    expect(payload.template).toBe('KITCHEN_BATCH');
    expect(payload.items).toHaveLength(1);
    expect(payload.header.batchId).toBe('batch-abc');
  });

  it('buildOrderTabReceiptPayload consolida comanda inteira', () => {
    const payload = buildOrderTabReceiptPayload({
      paperWidthMm: 58,
      locationName: 'Centro',
      tableIdentifier: 'Mesa 5',
      orderTabSequence: 2,
      items: [
        {
          _id: 'i1',
          productId: 'p1',
          productName: 'Burger',
          quantity: 2,
          discount: 0,
          productPrice: 10,
          total: 20,
          complements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: 'i2',
          productId: 'p2',
          productName: 'Coca',
          quantity: 1,
          discount: 0,
          productPrice: 5,
          total: 5,
          complements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pricing: { total: 25, discount: 0, fees: 0 },
      payments: [
        {
          total: 25,
          paidAmount: 25,
          method: 'PIX' as never,
          instalments: 1,
        },
      ],
    });

    expect(payload.template).toBe('ORDER_TAB_RECEIPT');
    expect(payload.items).toHaveLength(2);
    expect(payload.totals.total).toBe(25);
    expect(payload.totals.payments).toEqual([{ method: 'PIX', amount: 25 }]);
  });

  it('buildItemChangePayload monta ticket de atualização com quantidade anterior e nova', () => {
    const payload = buildItemChangePayload({
      changeType: 'UPDATED',
      paperWidthMm: 80,
      locationName: 'Centro',
      tableIdentifier: 'Mesa 5',
      orderTabSequence: 1,
      item: {
        itemId: 'i1',
        productName: 'Burger',
        complements: [],
      },
      previousQuantity: 1,
      quantity: 3,
    });

    expect(payload.template).toBe('ITEM_UPDATED');
    expect(payload.item.previousQuantity).toBe(1);
    expect(payload.item.quantity).toBe(3);
  });

  it('buildItemChangePayload monta ticket de cancelamento com quantidade removida e restante', () => {
    const payload = buildItemChangePayload({
      changeType: 'REMOVED',
      paperWidthMm: 80,
      locationName: 'Centro',
      tableIdentifier: 'Mesa 5',
      orderTabSequence: 1,
      item: {
        itemId: 'i1',
        productName: 'Burger',
        complements: [],
      },
      quantity: 1,
      remainingQuantity: 2,
    });

    expect(payload.template).toBe('ITEM_REMOVED');
    expect(payload.item.quantity).toBe(1);
    expect(payload.item.remainingQuantity).toBe(2);
  });
});
