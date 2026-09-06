// Template: __module-folder__.module.ts
// Composição de dependências 100% via @Module do Nest — não existe main/factories.
// Registrar este módulo em src/app.module.ts (import + adicionar aos `imports`).
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationEntitiesModule } from '@modules/organizations/organization-entities.module';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import {
  __EntityName__,
  __EntityName__Schema,
} from './entities/__entityName__';
import { __EntityName__DataSource } from './datasources/__entityName__.datasource';
import { __EntityName__Resolver } from './__module-folder-singular__.resolver';
import { Create__EntityName__UseCase } from './usecases/create-__entity-name__.usecase';

@Module({
  imports: [
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
      { name: __EntityName__.name, schema: __EntityName__Schema },
    ]),
  ],
  providers: [
    __EntityName__Resolver,
    __EntityName__DataSource,
    OrganizationExistsUseCase,
    Create__EntityName__UseCase,
  ],
})
export class __EntityName__Module {}
