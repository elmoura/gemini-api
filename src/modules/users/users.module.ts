import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { User, UserSchema } from './entities/user';
import { UserDataSource } from './datasources/user.datasource';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CryptoService } from '@shared/services/crypto.service';

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
    CryptoService,
    UserResolver,
    UserDataSource,
    AccountConfirmationUseCase,
  ],
  exports: [],
})
export class UserModule {}
