import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDataSource } from './datasources/user.datasource';
import { User, UserSchema } from './entities/user';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserResolver, UserDataSource, AccountConfirmationUseCase],
  exports: [],
})
export class UserModule {}
