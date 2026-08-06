import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { OrderTabObj } from './types/table-order.object';
import { ListOrderTabsInput } from './types/find-order-tab.input';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';

@Injectable()
export class ListOrderTabsUseCase {
  constructor(
    private orderTabDataSource: OrderTabDataSource,
    private tableOrderDataSource: TableOrderDataSource,
  ) {}

  async execute(
    input: ListOrderTabsInput & CurrentUserData,
  ): Promise<OrderTabObj[]> {
    if (!input.organizationId) throw new UnauthorizedException();

    const tableOrder = await this.tableOrderDataSource.findById(
      input.tableOrderId,
      input.organizationId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    return this.orderTabDataSource.findByTableOrderId(
      input.tableOrderId,
      input.organizationId,
    );
  }
}
