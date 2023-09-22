import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import { OrganizationEntitiesModule } from '@modules/organizations/organization-entities.module';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';
import { TablesResolver } from './tables.resolver';
import { Table, TableSchema } from './entities/table';
import { TableDataSource } from './datasources/table.datasource';
import { CreateTableUseCase } from './usecases/create-table.usecase';
import { ListLocationTablesUseCase } from './usecases/list-location-tables.usecase';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { TableOrder, TableOrderSchema } from './entities/table-order';
import { TableOrderDataSource } from './datasources/table-order.datasource';
import { TableOrderResolver } from './table-order.resolver';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { Product, ProductSchema } from '@modules/products/entities/product';
import {
  TableOrderItem,
  TableOrderItemSchema,
} from './entities/table-order-item';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { AddTableOrderItemsUseCase } from './usecases/add-table-order-items.usecase';

/**
 * @description
 * - O módulo de mesas cria uma estrutura base para o restaurante realizar
 * atendimentos no local.
 * - A mesa é criada como um local de atendimento
 * - Pedidos sao realizados a partir daquela mesa
 * - Os pedidos contem os produtos cadastrados pelo restaurante em TableOrder
 */
@Module({
  imports: [
    AuthModule,
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
      { name: Table.name, schema: TableSchema },
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
    ]),
  ],
  providers: [
    TablesResolver,
    TableOrderResolver,
    TableDataSource,
    TableOrderDataSource,
    ProductDataSource,
    CreateTableUseCase,
    CreateTableOrderUseCase,
    ListTableOrdersUseCase,
    AddTableOrderItemsUseCase,
    ListLocationTablesUseCase,
    OrganizationExistsUseCase,
    OrganizationLocationExistsUseCase,
  ],
})
export class TablesModule {}
