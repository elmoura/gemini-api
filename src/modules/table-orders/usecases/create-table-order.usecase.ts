import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateTableOrderInput } from './types/create-table-order.input';
import {
  TableOrderPayment,
  TableOrderPricing,
  TableOrder,
} from '../entities/table-order';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { TableOrderItem } from '../entities/table-order-item';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';
import { TableDataSource } from '../../table/datasources/table.datasource';
import { TableNotFoundException } from '../../table/errors/table-not-found';
import { TableAlreadyOpenException } from '../errors/table-already-open';
import { CurrentUserData } from '@shared/decorators/current-user';
import { LocationShiftDataSource } from '@modules/location-shifts/datasources/location-shift.datasource';
import { NoOpenLocationShiftException } from '@modules/location-shifts/errors/no-open-location-shift';

@Injectable()
export class CreateTableOrderUseCase
  implements IBaseUseCase<CreateTableOrderInput & CurrentUserData, TableOrder>
{
  constructor(
    private tableDataSource: TableDataSource,
    private tableOrderDataSource: TableOrderDataSource,
    private locationShiftDataSource: LocationShiftDataSource,
  ) {}

  async execute(
    input: CreateTableOrderInput & CurrentUserData,
  ): Promise<TableOrder> {
    if (!input.organizationId || !input.locationId)
      throw new UnauthorizedException();

    const table = await this.tableDataSource.findByTableAndOrgId(
      input.tableId,
      input.organizationId,
    );

    if (!table) throw new TableNotFoundException();

    const existingOpen = await this.tableOrderDataSource.findOpenByTableId(
      input.tableId,
      input.organizationId,
    );

    if (existingOpen) throw new TableAlreadyOpenException();

    const openShift = await this.locationShiftDataSource.findOpenByLocation(
      input.organizationId,
      input.locationId,
    );

    if (!openShift) throw new NoOpenLocationShiftException();

    const tableOrder = await this.tableOrderDataSource.createOne({
      organizationId: input.organizationId,
      locationId: input.locationId,
      table: {
        _id: table._id,
        identifier: table.identifier,
      },
      status: TableOrderStatuses.IN_ATTENDANCE,
      tabIds: [],
      pricing: { total: 0, discount: 0, fees: 0 },
      payment: {
        total: 0,
        paidAmount: 0,
        instalments: 0,
        paymentStatus: TableOrderPaymentStatuses.PENDING,
      },
    });

    await this.locationShiftDataSource.incrementTableOrderQuantity(
      openShift._id,
      input.organizationId,
    );

    return tableOrder;
  }

  /* LEGACY — lógica de items movida para create-order-tab.usecase.ts
  private formatPaymentInfo(items: TableOrderItem[]): TableOrderPayment {
    const total = items.reduce((accum, item) => accum + item.total, 0);

    return {
      total,
      paidAmount: 0,
      instalments: 0,
      paymentStatus: TableOrderPaymentStatuses.PENDING,
    };
  }

  private formatPricingInfo(items: TableOrderItem[]): TableOrderPricing {
    const total = items.reduce((accum, item) => accum + item.total, 0);
    const discount = items.reduce((accum, item) => accum + item.discount, 0);

    return {
      total,
      discount,
      fees: 0,
    };
  }
  */
}

export type { TableOrderItem, TableOrderPayment, TableOrderPricing };
