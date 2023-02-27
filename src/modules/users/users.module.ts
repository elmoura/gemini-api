import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user';
import { UserDataSource } from './datasources/user.datasource';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CryptoService } from '@shared/services/crypto.service';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { TokenService } from '@shared/services/token.service';
import { LoginUserUseCase } from './usecases/login-user.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
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
    LoginUserUseCase,
    CreateUserInvitationUseCase,
    AccountConfirmationUseCase,
  ],
  exports: [],
})
export class UserModule {}
