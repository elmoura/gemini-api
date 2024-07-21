import { Injectable } from '@nestjs/common';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { TableOrderDataSource } from '@modules/table-orders/datasources/table-order.datasource';
import { TableOrderNotFoundException } from '@modules/table-orders/errors/table-order-not-found';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '@modules/table-orders/enums/table-order-statuses';
import { TableOrderNotUpdated } from '@modules/table-orders/errors/table-order-not-updated';
import { FinishTableOrderInput } from './types/finish-table-order.input';

@Injectable()
export class FinishTableOrderUseCase {
  constructor(private tableOrderDataSource: TableOrderDataSource) {}

  async execute(input: FinishTableOrderInput): Promise<TableOrder> {
    const { tableOrderId, organizationId } = input;

    const tableOrder = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    if (tableOrder.status !== TableOrderStatuses.IN_ATTENDANCE) {
      throw new TableOrderNotUpdated(
        'O pedido estar "em atendimento" para ser finalizado',
      );
    }

    let totalOrderPrice = tableOrder.pricing.total;
    const serviceTaxPrice = input.payServiceTax ? totalOrderPrice * 0.1 : 0;

    if (serviceTaxPrice) {
      totalOrderPrice = totalOrderPrice + serviceTaxPrice;
    }

    /**
     * @observation
     * - Atualmente ainda não aceita a lógica de pedidos pagos parcialmente,
     * estamos considerando que sempre foi pago 1x no fechamento do pedido
     */
    await this.tableOrderDataSource.updateOne(tableOrderId, organizationId, {
      status: TableOrderStatuses.FINISHED,
      pricing: {
        fees: serviceTaxPrice,
        total: totalOrderPrice,
      },
      payment: {
        instalments: input.payment.instalments,
        method: input.payment.method,
        paidAmount: totalOrderPrice,
        total: totalOrderPrice,
        paymentStatus: TableOrderPaymentStatuses.PAID,
      },
    });

    const updatedOrder = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    return updatedOrder;
  }
}
