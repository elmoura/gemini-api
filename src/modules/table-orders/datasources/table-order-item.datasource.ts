import { Injectable } from '@nestjs/common';
import { TableOrderItem } from '../entities/table-order-item';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { TableOrder } from '../entities/table-order';

interface ITableOrderItemDataSource {
  updateItem(
    orderId: string,
    itemId: string,
    data: Partial<TableOrderItem>,
  ): Promise<boolean>;
  pushItem(orderId: string, item: Partial<TableOrderItem>): Promise<boolean>;
}

@Injectable()
export class TableOrderItemDataSource implements ITableOrderItemDataSource {
  constructor(
    @InjectModel(TableOrder.name)
    private tableOrderModel: Model<TableOrder>,
  ) {}

  async pushItem(
    orderId: string,
    item: Partial<TableOrderItem>,
  ): Promise<boolean> {
    const result = await this.tableOrderModel.updateOne(
      { _id: orderId },
      { $push: { items: item } },
    );

    return result.matchedCount > 0;
  }

  async updateItem(
    orderId: string,
    itemId: string,
    data: Partial<TableOrderItem>,
  ): Promise<boolean> {
    const setData = {};
    Object.keys(data).forEach((key) => {
      setData[`items.$.${key}`] = data[key];
    });

    const result = await this.tableOrderModel.updateOne(
      {
        _id: orderId,
        'items._id': itemId,
      },
      {
        $set: setData,
      },
    );

    return result.matchedCount > 0;
  }
}
