import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UserDataSource } from '../datasources/user.datasource';
import { User } from '../entities/user';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { AccountConfirmationInput } from './dto/account-confirmation.input';
import { AccountConfirmationOutput } from './dto/account-confirmation.output';

@Injectable()
export class AccountConfirmationUseCase
  implements IBaseUseCase<AccountConfirmationInput, AccountConfirmationOutput>
{
  constructor(private userDataSource: UserDataSource) {}

  async execute({
    userId,
  }: AccountConfirmationInput): Promise<AccountConfirmationOutput> {
    const userExists = await this.userDataSource.findById(userId);

    if (!userExists) {
      throw new Error('Usuário não encontrado :(');
    }

    const updateData = {
      accountStatus: AccountStatuses.CONFIRMED,
    };

    await this.userDataSource.updateOne(userId, updateData);

    return {
      ...updateData,
      _id: userId,
    };
  }
}
