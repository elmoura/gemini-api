import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrderTab } from '../entities/order-tab';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { FinishOrderTabInput } from './types/finish-order-tab.input';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';
import { OrderTabNotUpdated } from '../errors/order-tab-not-updated';
import { OrderTabNotFullyPaidException } from '../errors/order-tab-not-fully-paid';
import { OrderTabStatuses } from '../enums/order-tab-statuses';
import { TableOrderPaymentStatuses } from '../enums/table-order-statuses';
import { syncTableOrderFromTabs } from './helpers/sync-table-order-from-tabs';
import { PrintJobService } from '@modules/print-jobs/services/print-job.service';

@Injectable()
export class FinishOrderTabUseCase {
  constructor(
    private orderTabDataSource: OrderTabDataSource,
    private tableOrderDataSource: TableOrderDataSource,
    @Inject(forwardRef(() => PrintJobService))
    private printJobService: PrintJobService,
  ) {}

  async execute(input: FinishOrderTabInput): Promise<OrderTab> {
    const tab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    if (!tab) throw new OrderTabNotFoundException();

    if (tab.status !== OrderTabStatuses.IN_ATTENDANCE) {
      throw new OrderTabNotUpdated(
        'A comanda deve estar "em atendimento" para ser finalizada',
      );
    }

    // Gate financeiro migrou para addOrderTabPayment (B2) — aqui só se
    // confere que a comanda já foi paga integralmente via payments[].
    if (tab.paymentStatus !== TableOrderPaymentStatuses.PAID) {
      throw new OrderTabNotFullyPaidException();
    }

    let totalTabPrice = tab.pricing.total;
    const serviceTax = input.payServiceTax ? totalTabPrice * 0.1 : 0;

    if (serviceTax) {
      totalTabPrice += serviceTax;
    }

    await this.orderTabDataSource.updateOne(
      input.orderTabId,
      input.organizationId,
      {
        status: OrderTabStatuses.FINISHED,
        pricing: {
          ...tab.pricing,
          fees: serviceTax,
          total: totalTabPrice,
        },
      },
    );

    await syncTableOrderFromTabs(
      tab.tableOrderId,
      input.organizationId,
      this.orderTabDataSource,
      this.tableOrderDataSource,
    );

    const finalTab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    this.printJobService.enqueueOrderTabPaidJob({
      orderTab: finalTab,
      source: input.source,
    });

    return finalTab;
  }
}
