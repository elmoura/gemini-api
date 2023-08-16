import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user';
import { UserDataSource } from './datasources/user.datasource';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CryptoService } from '@shared/services/crypto.service';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { TokenService } from '@modules/auth/services/token.service';
import { LoginUserUseCase } from './usecases/login-user.usecase';
import { GetUserUseCase } from './usecases/get-user.usecase';
import { SetUserLocationUseCase } from './usecases/set-user-location.usecase';
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
    ]),
  ],
  providers: [
    TokenService,
    EmailService,
    CryptoService,
    UserResolver,
    UserDataSource,
    GetUserUseCase,
    LoginUserUseCase,
    OrganizationLocationDataSource,
    SetUserLocationUseCase,
    CreateUserInvitationUseCase,
    AccountConfirmationUseCase,
  ],
  exports: [],
})
export class UserModule {}
