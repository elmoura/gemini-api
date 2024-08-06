import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { TableOrder } from '@modules/table-orders/entities/table-order';
import { TableOrderDataSource } from '@modules/table-orders/datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { AddTableOrderItemInput } from './types/add-table-order.input';
import { TableOrderNotFoundException } from '../errors/table-order-not-found';
import { formatOrderItem } from '../utils/format-order-item';
import { TableOrderItemDataSource } from '../datasources/table-order-item.datasource';
import { calculateTableOrderPrice } from '../utils/calculate-order-price';
import { InvalidProductId } from '../errors/invalid-product-id';

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
          const product = await this.productDataSource.findById(
            newItem.productId,
          );

          if (!product || product.organizationId !== organizationId) {
            throw new InvalidProductId(newItem.productId);
          }

          const formatedItem = formatOrderItem(newItem, product);
          return this.tableOrderItemDataSource.pushItem(
            tableOrderId,
            formatedItem,
          );
        }
      }),
    );

    const orderWithNewItems = await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );

    // soma todos novos valores e coloca novo valor no pedido
    const pricing = calculateTableOrderPrice(orderWithNewItems, {
      payServiceTax: false,
    });

    await this.tableOrderDataSource.updateOne(tableOrderId, organizationId, {
      pricing: {
        discount: pricing.discount,
        total: pricing.total,
        fees: pricing.fees,
      },
      payment: {
        ...orderWithNewItems.payment,
        total: pricing.total,
      },
    });

    return await this.tableOrderDataSource.findById(
      tableOrderId,
      organizationId,
    );
  }

  // private addTableOrderItem() {}
}
