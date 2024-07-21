import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { RemoveTableOrderItemInput } from './types/remove-table-order-item.input';
import { TableOrderDataSource } from '../datasources/table-order.datasource';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';
import { TableOrderStatuses } from '../enums/table-order-statuses';
import { TableOrderNotUpdated } from '../errors/table-order-not-updated';
import { TableOrderItemDataSource } from '../datasources/table-order-item.datasource';
import { InvalidItemId } from '../errors/invalid-item-id';
import { calculateTableOrderPrice } from '../utils/calculate-order-price';
import { TableOrder } from '../entities/table-order';

@Injectable()
export class RemoveTableOrderItemUseCase
  implements IBaseUseCase<RemoveTableOrderItemInput, TableOrder>
{
  constructor(
    private tableOrderDataSource: TableOrderDataSource,
    private tableOrderItemDataSource: TableOrderItemDataSource,
  ) {}

  async execute(input: RemoveTableOrderItemInput): Promise<TableOrder> {
    const { tableOrderId, organizationId, itemId } = input;

    const tableOrder = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    if (!tableOrder) {
      throw new TableOrderNotFoundException();
    }

    if (tableOrder.status !== TableOrderStatuses.IN_ATTENDANCE) {
      throw new TableOrderNotUpdated(
        `O pedido estar "em atendimento" para ser alterado`,
      );
    }

    // validar se o itemId existe no pedido
    console.log(tableOrder);

    let itemToRemoveIndex = -1;
    tableOrder.items.find((item, index) => {
      const itemMatched = item._id.toString() === itemId;

      if (itemMatched) itemToRemoveIndex = index;

      return itemMatched;
    });

    if (itemToRemoveIndex < 0) throw new InvalidItemId();

    // receber quantidade

    // se a quantidade de remoções for a quantidade de itens
    // apaga o item do array

    // caso contrario, apenas diminui a quantidade do item

    await this.tableOrderItemDataSource.removeItem(tableOrderId, itemId);

    tableOrder.items = tableOrder.items.splice(itemToRemoveIndex, 1);

    const pricing = calculateTableOrderPrice(tableOrder, {
      payServiceTax: false,
    });

    console.log(pricing);

    await this.tableOrderDataSource.updateOne(tableOrderId, organizationId, {
      payment: {
        ...tableOrder.payment,
        total: pricing.total,
      },
      pricing: {
        discount: pricing.discount,
        fees: pricing.fees,
        total: pricing.total,
      },
    });

    return this.tableOrderDataSource.findById(tableOrderId, organizationId);
  }
}
