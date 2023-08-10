import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import { CustomerResolver } from './customer.resolver';
import { CreateCustomerUseCase } from './usecases/create-customer.usecase';
import { CustomerDataSource } from './datasources/customer.datasource';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { CryptoService } from '@shared/services/crypto.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: Customer.name,
        schema: CustomerSchema,
      },
    ]),
  ],
  providers: [
    CryptoService,
    OrganizationDataSource,
    OrganizationExistsUseCase,
    CustomerResolver,
    CustomerDataSource,
    CreateCustomerUseCase,
  ],
})
export class CustomersModule {}
