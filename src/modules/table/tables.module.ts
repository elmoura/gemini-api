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
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [
    TablesResolver,
    TableDataSource,
    CreateTableUseCase,
    ListLocationTablesUseCase,
    OrganizationExistsUseCase,
    OrganizationLocationExistsUseCase,
  ],
})
export class TablesModule {}
