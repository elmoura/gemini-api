import { Injectable } from '@nestjs/common';
import { TableOrder } from '../entities/table-order';
import { RemoveTableOrderItemInput } from './types/remove-order-tab-item.input';

@Injectable()
export class RemoveTableOrderItemUseCase {
  /* LEGACY — deprecated. Ver remove-order-tab-item.usecase.ts */
  async execute(_input: RemoveTableOrderItemInput): Promise<TableOrder> {
    throw new Error(
      'removeTableOrderItem is deprecated. Use removeOrderTabItem.',
    );
  }
}
