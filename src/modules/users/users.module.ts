import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user';
import { UserDataSource } from './datasources/user.datasource';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CryptoService } from '@shared/services/crypto.service';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';

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
    EmailService,
    CryptoService,
    UserResolver,
    UserDataSource,
    CreateUserInvitationUseCase,
    AccountConfirmationUseCase,
  ],
  exports: [],
})
export class UserModule {}
