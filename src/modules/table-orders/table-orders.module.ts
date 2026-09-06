import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TableOrder, TableOrderSchema } from './entities/table-order';
import { OrderTab, OrderTabSchema } from './entities/order-tab';
import {
  TableOrderItem,
  TableOrderItemSchema,
} from './entities/table-order-item';
import { Product, ProductSchema } from '@modules/products/entities/product';
import { TableOrdersResolver } from './table-orders.resolver';
import { TableOrderDataSource } from './datasources/table-order.datasource';
import { OrderTabDataSource } from './datasources/order-tab.datasource';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { CreateOrderTabUseCase } from './usecases/create-order-tab.usecase';
import { AddOrderTabItemUseCase } from './usecases/add-order-tab-item.usecase';
import { RemoveOrderTabItemUseCase } from './usecases/remove-order-tab-item.usecase';
import { FinishOrderTabUseCase } from './usecases/finish-order-tab.usecase';
import { AddOrderTabPaymentUseCase } from './usecases/add-order-tab-payment.usecase';
import { FindTableOrderUseCase } from './usecases/find-table-order.usecase';
import { FindOrderTabUseCase } from './usecases/find-order-tab.usecase';
import { ListOrderTabsUseCase } from './usecases/list-order-tabs.usecase';
import { AddTableOrderItemUseCase } from './usecases/add-table-order-item.usecase';
import { Table, TableSchema } from '@modules/table/entities/table';
import { TableDataSource } from '@modules/table/datasources/table.datasource';
import { TableOrderItemDataSource } from './datasources/table-order-item.datasource';
import { AuthModule } from '@modules/auth/auth.module';
import { RemoveTableOrderItemUseCase } from './usecases/remove-table-order-item.usecase';
import { FinishTableOrderUseCase } from './usecases/finish-table-order.usecase';
import { LocationShiftsModule } from '@modules/location-shifts/location-shifts.module';
import { CashRegistersModule } from '@modules/cash-registers/cash-registers.module';
import { ComplementGroupsModule } from '@modules/complement-groups/complement-groups.module';
import { UpdateOrderTabItemUseCase } from './usecases/update-order-tab-item.usecase';
import { PrintJobsModule } from '@modules/print-jobs/print-jobs.module';

@Module({
  imports: [
    AuthModule,
    LocationShiftsModule,
    CashRegistersModule,
    ComplementGroupsModule,
    forwardRef(() => PrintJobsModule),
    MongooseModule.forFeature([
      {
        name: TableOrder.name,
        schema: TableOrderSchema,
      },
      {
        name: OrderTab.name,
        schema: OrderTabSchema,
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
    OrderTabDataSource,
    TableOrderDataSource,
    TableOrderItemDataSource,
    ProductDataSource,
    ListTableOrdersUseCase,
    CreateTableOrderUseCase,
    CreateOrderTabUseCase,
    AddOrderTabItemUseCase,
    RemoveOrderTabItemUseCase,
    FinishOrderTabUseCase,
    AddOrderTabPaymentUseCase,
    FindTableOrderUseCase,
    FindOrderTabUseCase,
    ListOrderTabsUseCase,
    AddTableOrderItemUseCase,
    RemoveTableOrderItemUseCase,
    FinishTableOrderUseCase,
    UpdateOrderTabItemUseCase,
  ],
  exports: [TableOrderDataSource, OrderTabDataSource],
})
export class TableOrdersModule {}
