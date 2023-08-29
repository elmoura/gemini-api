import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CurrentUserData } from '@shared/decorators/current-user';
import { ListTableOrdersInput } from './types/list-table-orders.input';
import { ListTableOrdersOutput } from './types/list-table-orders.output';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { TableOrderStatuses } from '../enums/table-order-statuses';

@Injectable()
export class ListTableOrdersUseCase
  implements
    IBaseUseCase<ListTableOrdersInput & CurrentUserData, ListTableOrdersOutput>
{
  constructor(private tableOrderDataSource: TableOrderDataSource) {}

  async execute(
    input: ListTableOrdersInput & CurrentUserData,
  ): Promise<ListTableOrdersOutput> {
    if (!input.locationId || !input.organizationId)
      throw new UnauthorizedException();

    const {
      limit = 20,
      offset = 0,
      status = undefined,
      creationDate = 'desc',
    } = input;

    const orders = await this.tableOrderDataSource.listByLocationAndFilters(
      input.locationId,
      {
        limit,
        offset,
        status,
        creationDate,
      },
    );

    return {
      limit,
      offset,
      ordersCount: orders.length,
      orders,
    };
  }
}
