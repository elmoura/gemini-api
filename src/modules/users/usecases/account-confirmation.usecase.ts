import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CryptoService } from '@shared/services/crypto.service';
import { UserDataSource } from '../datasources/user.datasource';
import { InvitationDataSource } from '../datasources/invitation.datasource';
import { InvitationStatus } from '../entities/invitation';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { ThemePreference } from '../enums/theme-preference';
import { AccountConfirmationInput } from './dto/account-confirmation.input';
import { AccountConfirmationOutput } from './dto/account-confirmation.output';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';
import { InvitationExpiredError } from '../errors/invitation-expired';

@Injectable()
export class AccountConfirmationUseCase
  implements IBaseUseCase<AccountConfirmationInput, AccountConfirmationOutput>
{
  constructor(
    private cryptoService: CryptoService,
    private userDataSource: UserDataSource,
    private invitationDataSource: InvitationDataSource,
  ) {}

  async execute(
    input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    const { token, firstName, lastName, phoneNumber, password } = input;

    const invitation = await this.invitationDataSource.findByToken(token);

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === InvitationStatus.CANCELLED) {
      throw new InvitationCancelledError();
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new InvitationAlreadyUsedError();
    }

    if (invitation.expiresAt.getTime() <= Date.now()) {
      await this.invitationDataSource.updateOne(invitation._id, {
        status: InvitationStatus.EXPIRED,
      });

      throw new InvitationExpiredError();
    }

    const encryptedPassword = this.cryptoService.encrypt(password);

    const user = await this.userDataSource.createOne({
      organizationId: invitation.organizationId,
      email: invitation.email,
      roles: invitation.roles,
      firstName,
      lastName,
      phoneNumber,
      password: encryptedPassword,
      accountStatus: AccountStatuses.CONFIRMED,
      themePreference: ThemePreference.SYSTEM,
    });

    await this.invitationDataSource.updateOne(invitation._id, {
      status: InvitationStatus.ACCEPTED,
    });

    return user;
  }
}
