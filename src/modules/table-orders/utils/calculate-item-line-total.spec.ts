import { calculateItemLineTotal } from './calculate-item-line-total';

describe('calculateItemLineTotal', () => {
  it('inclui complementos no total da linha', () => {
    const total = calculateItemLineTotal({
      productPrice: 25,
      discount: 0,
      quantity: 2,
      complements: [
        {
          complementId: 'comp-bacon',
          complementGroupId: 'group-1',
          name: 'Bacon',
          unitPrice: 4,
          quantity: 1,
        },
      ],
    });

    expect(total).toBe(58);
  });
});
