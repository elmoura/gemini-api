import { Injectable } from '@nestjs/common';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { TableOrderDataSource } from '@modules/table-orders/datasources/table-order.datasource';
import { OrderTabDataSource } from '@modules/table-orders/datasources/order-tab.datasource';
import { TableOrderNotFoundException } from '@modules/table-orders/errors/table-order-not-found';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '@modules/table-orders/enums/table-order-statuses';
import { TableOrderNotUpdated } from '@modules/table-orders/errors/table-order-not-updated';
import { FinishTableOrderInput } from './types/finish-order-tab.input';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { consolidateTableOrderFromTabs } from '../utils/consolidate-table-order-from-tabs';

@Injectable()
export class FinishTableOrderUseCase {
  constructor(
    private tableOrderDataSource: TableOrderDataSource,
    private orderTabDataSource: OrderTabDataSource,
  ) {}

  async execute(input: FinishTableOrderInput): Promise<TableOrder> {
    const { tableOrderId, organizationId } = input;

    const tableOrder = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    if (tableOrder.status !== TableOrderStatuses.IN_ATTENDANCE) {
      throw new TableOrderNotUpdated(
        'O pedido deve estar "em atendimento" para ser finalizado',
      );
    }

    const tabs = await this.orderTabDataSource.findByTableOrderId(
      tableOrderId,
      organizationId,
    );

    if (tabs.length === 0) {
      throw new TableOrderNotUpdated('Pedido sem comandas');
    }

    const hasOpenTab = tabs.some(
      (tab) => tab.status === OrderTabStatuses.IN_ATTENDANCE,
    );

    if (hasOpenTab) {
      throw new TableOrderNotUpdated('Existem comandas em atendimento');
    }

    const consolidated = consolidateTableOrderFromTabs(tabs);

    if (
      consolidated.payments[0].paymentStatus !== TableOrderPaymentStatuses.PAID
    ) {
      throw new TableOrderNotUpdated('Pagamento pendente');
    }

    await this.tableOrderDataSource.updateOne(tableOrderId, organizationId, {
      status: TableOrderStatuses.FINISHED,
      pricing: consolidated.pricing,
      payments: consolidated.payments,
    });

    return this.tableOrderDataSource.findById(tableOrderId, organizationId);
  }

  /* LEGACY — pagamento movido para finish-order-tab.usecase.ts
  async executeLegacy(input: FinishTableOrderInput & { payServiceTax: boolean; payment: ... }): Promise<TableOrder> {
    ...
  }
  */
}
