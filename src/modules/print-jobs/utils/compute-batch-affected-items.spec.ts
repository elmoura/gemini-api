import { computeBatchAffectedItems } from './compute-batch-affected-items';
import { TableOrderItem } from '@modules/table-orders/entities/table-order-item';

describe('computeBatchAffectedItems', () => {
  const existingItem: TableOrderItem = {
    _id: 'item-1',
    productId: 'prod-1',
    productName: 'Burger',
    quantity: 2,
    discount: 0,
    productPrice: 10,
    total: 20,
    observation: 'Sem cebola',
    complements: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('retorna delta de quantity quando item já existia', () => {
    const itemsBefore = [existingItem];
    const itemsAfter = [{ ...existingItem, quantity: 4, total: 40 }];
    const inputItems = [{ productId: 'prod-1', quantity: 2, observation: 'Sem cebola' }];

    const result = computeBatchAffectedItems(itemsBefore, itemsAfter, inputItems);

    expect(result).toEqual([
      expect.objectContaining({
        itemId: 'item-1',
        productName: 'Burger',
        quantity: 2,
      }),
    ]);
  });

  it('retorna item novo com quantity do input', () => {
    const newItem: TableOrderItem = {
      _id: 'item-2',
      productId: 'prod-2',
      productName: 'Coca',
      quantity: 3,
      discount: 0,
      productPrice: 5,
      total: 15,
      complements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const inputItems = [{ productId: 'prod-2', quantity: 3 }];

    const result = computeBatchAffectedItems([], [newItem], inputItems);

    expect(result).toEqual([
      expect.objectContaining({
        itemId: 'item-2',
        productName: 'Coca',
        quantity: 3,
      }),
    ]);
  });

  it('processa múltiplos itens do lote', () => {
    const item2: TableOrderItem = {
      _id: 'item-2',
      productId: 'prod-2',
      productName: 'Coca',
      quantity: 1,
      discount: 0,
      productPrice: 5,
      total: 5,
      complements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const inputItems = [
      { productId: 'prod-1', quantity: 1, observation: 'Sem cebola' },
      { productId: 'prod-2', quantity: 1 },
    ];

    const result = computeBatchAffectedItems(
      [existingItem],
      [existingItem, item2],
      inputItems,
    );

    expect(result).toHaveLength(2);
  });
});
