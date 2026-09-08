import { PaymentMethods } from '@shared/enums/payment-methods';
import { buildOrderTabReceiptPayload } from './build-order-tab-receipt-payload';

describe(buildOrderTabReceiptPayload, () => {
  const baseParams = {
    paperWidthMm: 80 as const,
    locationName: 'Unidade Centro',
    tableIdentifier: 'Mesa 5',
    orderTabSequence: 1,
    items: [],
    pricing: { total: 40, fees: 0, discount: 0 },
  };

  it('inclui receivedAmount e changeAmount no pagamento em dinheiro quando informados', () => {
    const payload = buildOrderTabReceiptPayload({
      ...baseParams,
      payments: [
        {
          total: 40,
          paidAmount: 40,
          method: PaymentMethods.CASH,
          receivedAmount: 50,
        } as never,
      ],
    });

    expect(payload.totals.payments).toEqual([
      expect.objectContaining({
        method: PaymentMethods.CASH,
        amount: 40,
        receivedAmount: 50,
        changeAmount: 10,
      }),
    ]);
  });

  it('não inclui receivedAmount/changeAmount quando o pagamento em dinheiro não informa valor recebido', () => {
    const payload = buildOrderTabReceiptPayload({
      ...baseParams,
      payments: [
        { total: 40, paidAmount: 40, method: PaymentMethods.CASH } as never,
      ],
    });

    expect(payload.totals.payments).toEqual([
      { method: PaymentMethods.CASH, amount: 40 },
    ]);
  });

  it('não inclui receivedAmount/changeAmount para métodos diferentes de dinheiro', () => {
    const payload = buildOrderTabReceiptPayload({
      ...baseParams,
      payments: [
        {
          total: 40,
          paidAmount: 40,
          method: PaymentMethods.PIX,
          receivedAmount: 50,
        } as never,
      ],
    });

    expect(payload.totals.payments).toEqual([
      { method: PaymentMethods.PIX, amount: 40 },
    ]);
  });
});
