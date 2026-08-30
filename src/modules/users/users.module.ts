import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user';
import { Invitation, InvitationSchema } from './entities/invitation';
import { UserDataSource } from './datasources/user.datasource';
import { InvitationDataSource } from './datasources/invitation.datasource';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CryptoService } from '@shared/services/crypto.service';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { ResendInvitationUseCase } from './usecases/resend-invitation.usecase';
import { CancelInvitationUseCase } from './usecases/cancel-invitation.usecase';
import { ListInvitationsUseCase } from './usecases/list-invitations.usecase';
import { EmailService } from '@shared/services/email.service';
import { TokenService } from '@modules/auth/services/token.service';
import { LoginUserUseCase } from './usecases/login-user.usecase';
import { GetUserUseCase } from './usecases/get-user.usecase';
import { SetUserLocationUseCase } from './usecases/set-user-location.usecase';
import { UpdateUserPreferencesUseCase } from './usecases/update-user-preferences.usecase';
import { ListOrganizationUsersUseCase } from './usecases/list-organization-users.usecase';
import { UpdateUserRolesUseCase } from './usecases/update-user-roles.usecase';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import {
  OrganizationLocation,
  OrganizationLocationSchema,
} from '@modules/organizations/entities/organization-location';
import { OrganizationLocationDataSource } from '@modules/organizations/datasources/organization-location.datasource';

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
    TokenService,
    EmailService,
    CryptoService,
    UserResolver,
    UserDataSource,
    InvitationDataSource,
    GetUserUseCase,
    LoginUserUseCase,
    OrganizationLocationDataSource,
    SetUserLocationUseCase,
    UpdateUserPreferencesUseCase,
    CreateUserInvitationUseCase,
    ResendInvitationUseCase,
    CancelInvitationUseCase,
    ListInvitationsUseCase,
    AccountConfirmationUseCase,
    ListOrganizationUsersUseCase,
    UpdateUserRolesUseCase,
  ],
  exports: [],
})
export class UserModule {}
