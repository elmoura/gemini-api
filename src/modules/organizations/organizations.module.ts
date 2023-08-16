import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import { Organization, OrganizationSchema } from './entities/organization';
import { OrganizationResolver } from './organization.resolver';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { OrganizationDataSource } from './datasources/organization.datasource';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserDataSource } from '@modules/users/datasources/user.datasource';
import {
  OrganizationLocation,
  OrganizationLocationSchema,
} from './entities/organization-location';
import { CreateOrganizationLocationUseCase } from './usecases/create-organization-location.usecase';
import { OrganizationLocationDataSource } from './datasources/organization-location.datasource';
import { GetOrganizationUseCase } from './usecases/get-organization.usecase';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
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
  providers: [
    EmailService,
    UserDataSource,
    OrganizationResolver,
    OrganizationDataSource,
    OrganizationLocationDataSource,
    GetOrganizationUseCase,
    CreateUserInvitationUseCase,
    CreateOrganizationUseCase,
    CreateOrganizationLocationUseCase,
  ],
})
export class OrganizationModule {}
