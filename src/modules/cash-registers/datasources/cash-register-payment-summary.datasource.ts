import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderTab,
  OrderTabDocument,
} from '@modules/table-orders/entities/order-tab';
import { PaymentMethods } from '@shared/enums/payment-methods';
import {
  CashRegisterPaymentMethodTotal,
  CashRegisterPaymentSummary,
} from '../entities/cash-register';
import {
  buildEmptyCashRegisterSummary,
  roundToCents,
} from '../utils/cash-register-summary.utils';

type PaymentMethodBucket = {
  _id: PaymentMethods | null;
  total: number;
  count: number;
};

interface ICashRegisterPaymentSummaryDataSource {
  summarizeByCashRegister(
    organizationId: string,
    locationId: string,
    cashRegisterId: string,
  ): Promise<CashRegisterPaymentSummary>;
}

/**
 * Read model: lê `order_tabs` READ-ONLY para apurar as entradas de um caixa.
 * `cash-registers` registra o schema de `OrderTab` no próprio módulo e NÃO
 * importa `TableOrdersModule` — ver ADR-5 (sem ciclo de DI).
 */
@Injectable()
export class CashRegisterPaymentSummaryDataSource
  implements ICashRegisterPaymentSummaryDataSource
{
  constructor(
    @InjectModel(OrderTab.name)
    private orderTabModel: Model<OrderTabDocument>,
  ) {}

  async summarizeByCashRegister(
    organizationId: string,
    locationId: string,
    cashRegisterId: string,
  ): Promise<CashRegisterPaymentSummary> {
    const buckets: PaymentMethodBucket[] = await this.orderTabModel.aggregate([
      {
        $match: {
          // organizationId e locationId são OBRIGATÓRIOS aqui: sem eles um
          // cashRegisterId vazado expõe faturamento de outra organização.
          organizationId,
          locationId,
          'payments.cashRegisterId': cashRegisterId,
        },
      },
      { $unwind: '$payments' },
      {
        // Obrigatório pós-$unwind: sem re-filtrar, pagamentos de OUTRO caixa
        // na mesma tab (pagamento parcial atravessando troca de caixa)
        // entrariam na apuração deste caixa.
        $match: {
          'payments.cashRegisterId': cashRegisterId,
        },
      },
      {
        $group: {
          _id: '$payments.method',
          total: { $sum: '$payments.paidAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return buckets.reduce<CashRegisterPaymentSummary>((summary, bucket) => {
      const total = roundToCents(bucket.total ?? 0);
      const count = bucket.count ?? 0;

      const byMethod: CashRegisterPaymentMethodTotal[] = bucket._id
        ? [...summary.byMethod, { method: bucket._id, total, count }]
        : summary.byMethod;

      // ADR-4: só o bucket de dinheiro alimenta a conferência.
      const isCash = bucket._id === PaymentMethods.CASH;

      return {
        totalCashPayments: roundToCents(
          summary.totalCashPayments + (isCash ? total : 0),
        ),
        totalNonCashPayments: roundToCents(
          summary.totalNonCashPayments + (isCash ? 0 : total),
        ),
        byMethod,
        paymentsCount: summary.paymentsCount + count,
      };
    }, buildEmptyCashRegisterSummary());
  }
}
