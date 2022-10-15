import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import { Organization, OrganizationSchema } from './entities/organization';
import { OrganizationResolver } from './organization.resolver';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { OrganizationDataSource } from './datasources/organization.datasource';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    OrganizationResolver,
    OrganizationDataSource,
    CreateOrganizationUseCase,
  ],
})
export class OrganizationModule {}
