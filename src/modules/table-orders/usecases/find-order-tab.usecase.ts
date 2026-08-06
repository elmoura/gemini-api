import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { OrderTabObj } from './types/table-order.object';
import { FindOrderTabInput } from './types/find-order-tab.input';
import { OrderTabDataSource } from '../datasources/order-tab.datasource';
import { OrderTabNotFoundException } from '../errors/order-tab-not-found';

@Injectable()
export class FindOrderTabUseCase {
  constructor(private orderTabDataSource: OrderTabDataSource) {}

  async execute(
    input: FindOrderTabInput & CurrentUserData,
  ): Promise<OrderTabObj> {
    if (!input.organizationId) throw new UnauthorizedException();

    const orderTab = await this.orderTabDataSource.findById(
      input.orderTabId,
      input.organizationId,
    );

    if (!orderTab) throw new OrderTabNotFoundException();

    return orderTab;
  }
}
