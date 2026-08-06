import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { TableOrderObj } from './types/table-order.object';
import { FindTableOrderInput } from './types/find-order-tab.input';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';

@Injectable()
export class FindTableOrderUseCase {
  constructor(
    private tableOrderDataSource: TableOrderDataSource,
    private orderTabDataSource: OrderTabDataSource,
  ) {}

  async execute(
    input: FindTableOrderInput & CurrentUserData,
  ): Promise<TableOrderObj> {
    if (!input.organizationId) throw new UnauthorizedException();

    const tableOrder = await this.tableOrderDataSource.findById(
      input.tableOrderId,
      input.organizationId,
    );

    if (!tableOrder) throw new TableOrderNotFoundException();

    const tabs = await this.orderTabDataSource.findByTableOrderId(
      input.tableOrderId,
      input.organizationId,
    );

    return {
      ...tableOrder,
      tabs,
    };
  }
}
