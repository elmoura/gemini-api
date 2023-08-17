import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import { Organization, OrganizationSchema } from './entities/organization';
import {
  OrganizationLocation,
  OrganizationLocationSchema,
} from './entities/organization-location';
import { OrganizationDataSource } from './datasources/organization.datasource';
import { OrganizationLocationDataSource } from './datasources/organization-location.datasource';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: OrganizationLocation.name,
        schema: OrganizationLocationSchema,
      },
    ]),
  ],
  providers: [OrganizationDataSource, OrganizationLocationDataSource],
  exports: [OrganizationDataSource, OrganizationLocationDataSource],
})
export class OrganizationEntitiesModule {}
