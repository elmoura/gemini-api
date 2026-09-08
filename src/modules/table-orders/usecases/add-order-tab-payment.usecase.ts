import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrderTab } from '../entities/order-tab';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { CashRegisterDataSource } from '@modules/cash-registers/datasources/cash-register.datasource';
import { CashRegisterNotOpenException } from '@modules/cash-registers/errors/cash-register-not-open.exception';
import { AddOrderTabPaymentInput } from './types/add-order-tab-payment.input';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { PaymentExceedsTotalException } from '../errors/payment-exceeds-total';
import { InvalidReceivedAmountException } from '../errors/invalid-received-amount';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { deriveOrderTabPaymentStatus } from '../utils/derive-order-tab-payment-status';

/** Tolerância de ponto flutuante para não rejeitar overpayment por ruído de centavos. */
const OVERPAYMENT_TOLERANCE = 0.005;

@Injectable()
export class AddOrderTabPaymentUseCase
  implements IBaseUseCase<AddOrderTabPaymentInput, OrderTab>
{
  constructor(
    private orderTabDataSource: OrderTabDataSource,
    private cashRegisterDataSource: CashRegisterDataSource,
  ) {}

  async execute(input: AddOrderTabPaymentInput): Promise<OrderTab> {
    const tab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    if (!tab) throw new OrderTabNotFoundException();

    if (tab.status !== OrderTabStatuses.IN_ATTENDANCE) {
      throw new OrderTabNotUpdated(
        'A comanda deve estar "em atendimento" para receber pagamento',
      );
    }

    // Gate financeiro: todo pagamento pertence a um caixa aberto (ADR-2).
    const cashRegister = await this.cashRegisterDataSource.findOpenByLocation(
      tab.organizationId,
      tab.locationId,
    );

    if (!cashRegister) throw new CashRegisterNotOpenException();

    const alreadyPaid = tab.payments.reduce(
      (sum, payment) => sum + (payment.paidAmount ?? 0),
      0,
    );

    if (alreadyPaid + input.amount > tab.pricing.total + OVERPAYMENT_TOLERANCE) {
      throw new PaymentExceedsTotalException();
    }

    if (
      input.receivedAmount !== undefined &&
      (input.method !== PaymentMethods.CASH ||
        input.receivedAmount < input.amount - OVERPAYMENT_TOLERANCE)
    ) {
      throw new InvalidReceivedAmountException();
    }

    const payments = [
      ...tab.payments,
      {
        total: tab.pricing.total,
        paidAmount: input.amount,
        method: input.method,
        instalments: input.instalments ?? 0,
        receivedAmount:
          input.method === PaymentMethods.CASH ? input.receivedAmount : undefined,
        cashRegisterId: cashRegister._id,
        paidAt: new Date(),
      },
    ];

    await this.orderTabDataSource.updateOne(
      input.orderTabId,
      input.organizationId,
      {
        payments,
        paymentStatus: deriveOrderTabPaymentStatus(
          payments,
          tab.pricing.total,
        ),
      },
    );

    return this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );
  }
}
