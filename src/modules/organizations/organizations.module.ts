import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import {
  Invitation,
  InvitationSchema,
} from '@modules/users/entities/invitation';
import { OrganizationResolver } from './organization.resolver';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserDataSource } from '@modules/users/datasources/user.datasource';
import { InvitationDataSource } from '@modules/users/datasources/invitation.datasource';
import { CreateOrganizationLocationUseCase } from './usecases/create-organization-location.usecase';
import { GetOrganizationUseCase } from './usecases/get-organization.usecase';
import { OrganizationEntitiesModule } from './organization-entities.module';
import { ListOrganizationLocationsUseCase } from './usecases/list-organization-locations.usecase';

@Module({
  imports: [
    AuthModule,
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Invitation.name,
        schema: InvitationSchema,
      },
    ]),
  ],
  providers: [
    EmailService,
    UserDataSource,
    InvitationDataSource,
    OrganizationResolver,
    GetOrganizationUseCase,
    ListOrganizationLocationsUseCase,
    CreateUserInvitationUseCase,
    CreateOrganizationUseCase,
    CreateOrganizationLocationUseCase,
  ],
})
export class OrganizationModule {}
