import { Injectable } from '@nestjs/common';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { AddTableOrderItemInput } from './types/add-order-tab-item.input';

@Injectable()
export class AddTableOrderItemUseCase {
  /* LEGACY — deprecated. Ver add-order-tab-item.usecase.ts */
  async execute(_input: AddTableOrderItemInput): Promise<TableOrder> {
    throw new Error('addTableOrderItem is deprecated. Use addOrderTabItem.');
  }
}
