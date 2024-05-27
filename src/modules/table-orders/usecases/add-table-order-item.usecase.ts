import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { TableOrderDataSource } from '@modules/table-orders/datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { AddTableOrderItemInput } from './types/add-table-order.input';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';
import { formatOrderItem } from '../utils/format-order-item';
import { TableOrderItemDataSource } from '../datasources/table-order-item.datasource';

@Injectable()
export class AddTableOrderItemUseCase
  implements IBaseUseCase<AddTableOrderItemInput, TableOrder>
{
  constructor(
    private tableOrderDataSource: TableOrderDataSource,
    private tableOrderItemDataSource: TableOrderItemDataSource,
    private productDataSource: ProductDataSource,
  ) {}

  async execute(input: AddTableOrderItemInput): Promise<TableOrder> {
    const { tableOrderId, organizationId } = input;

    const order = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    if (!order) throw new TableOrderNotFoundException();

    await Promise.all(
      input.items.map(async (newItem) => {
        const equalOrderItem = order.items.find(
          (orderItem) =>
            newItem.productId === orderItem.productId &&
            newItem.observation.toLowerCase().trim() ===
              orderItem.observation.toLowerCase().trim(),
        );

        // item já existe no pedido?
        if (equalOrderItem) {
          // atualiza item no banco com quantidades atualizadas
          const totalQuantity = equalOrderItem.quantity + newItem.quantity;
          const totalPrice =
            (equalOrderItem.productPrice - equalOrderItem.discount) *
            totalQuantity;

          return await this.tableOrderItemDataSource.updateItem(
            tableOrderId.toString(),
            equalOrderItem._id.toString(),
            {
              total: totalPrice,
              quantity: totalQuantity,
            },
          );
        } else {
          // adiciona item no pedido
          const product = await this.productDataSource.findById(
            newItem.productId,
          );

          const formatedItem = formatOrderItem(newItem, product);
          return this.tableOrderItemDataSource.pushItem(
            tableOrderId,
            formatedItem,
          );
        }
      }),
    );

    // soma todos novos valores e coloca novo valor no pedido
    const orderWithNewItems = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    let newTotal = 0;
    let totalDiscount = 0;
    orderWithNewItems.items.forEach((item) => {
      totalDiscount += item.discount * item.quantity || 0;
      newTotal += item.total;
    });

    await this.tableOrderDataSource.updateOne(tableOrderId, organizationId, {
      pricing: {
        ...orderWithNewItems.pricing,
        discount: totalDiscount,
        total: newTotal,
      },
      payment: {
        ...orderWithNewItems.payment,
        total: newTotal,
      },
    });

    return await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );
  }
}
