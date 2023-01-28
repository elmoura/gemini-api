import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CryptoService } from '@shared/services/crypto.service';
import { UserDataSource } from '../datasources/user.datasource';
import { User } from '../entities/user';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { AccountConfirmationInput } from './dto/account-confirmation.input';
import { AccountConfirmationOutput } from './dto/account-confirmation.output';

@Injectable()
export class AccountConfirmationUseCase
  implements IBaseUseCase<AccountConfirmationInput, AccountConfirmationOutput>
{
  constructor(
    private cryptoService: CryptoService,
    private userDataSource: UserDataSource,
  ) {}

  async execute(
    input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    const { password, _id: userId } = input;

    const userExists = await this.userDataSource.findById(userId);

    if (!userExists) {
      throw new Error('Usuário não encontrado :(');
    }

    const encryptedPassword = this.cryptoService.encrypt(password);

    const updateData: Partial<User> = {
      password: encryptedPassword,
      accountStatus: AccountStatuses.CONFIRMED,
    };

    return this.userDataSource.updateOne(userId, updateData);
  }
}
