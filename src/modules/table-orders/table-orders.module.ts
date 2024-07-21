import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TableOrder, TableOrderSchema } from './entities/table-order';
import {
  TableOrderItem,
  TableOrderItemSchema,
} from './entities/table-order-item';
import { Product, ProductSchema } from '@modules/products/entities/product';
import { TableOrdersResolver } from './table-orders.resolver';
import { TableOrderDataSource } from './datasources/table-order.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { AddTableOrderItemUseCase } from './usecases/add-table-order-item.usecase';
import { Table, TableSchema } from '@modules/table/entities/table';
import { TableDataSource } from '@modules/table/datasources/table.datasource';
import { TableOrderItemDataSource } from './datasources/table-order-item.datasource';
import { AuthModule } from '@modules/auth/auth.module';
import { RemoveTableOrderItemUseCase } from './usecases/remove-table-order-item.usecase';
import { FinishTableOrderUseCase } from './usecases/finish-table-order.usecase';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: TableOrder.name,
        schema: TableOrderSchema,
      },
      {
        name: TableOrderItem.name,
        schema: TableOrderItemSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Table.name,
        schema: TableSchema,
      },
    ]),
  ],
  providers: [
    TableOrdersResolver,
    TableDataSource,
    TableOrderDataSource,
    TableOrderItemDataSource,
    ProductDataSource,
    ListTableOrdersUseCase,
    CreateTableOrderUseCase,
    AddTableOrderItemUseCase,
    RemoveTableOrderItemUseCase,
    FinishTableOrderUseCase,
  ],
})
export class TableOrdersModule {}
