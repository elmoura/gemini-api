import { join } from 'path';
import { randomBytes } from 'crypto';
import { renderFile } from 'pug';
import { Injectable } from '@nestjs/common';
import { Environment } from '@config/env';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { EmailService } from '@shared/services/email.service';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { UserDataSource } from '../datasources/user.datasource';
import { InvitationDataSource } from '../datasources/invitation.datasource';
import { InvitationStatus } from '../entities/invitation';
import { CreateUserInvitationInput } from './dto/create-user-invitation.input';
import { InvitationObject } from './dto/invitation.object';
import { UserAlreadyExistsError } from '../errors/user-already-exists';
import { InvitationAlreadyPendingError } from '../errors/invitation-already-pending';

const INVITATION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type CreateUserInvitationUseCaseInput = CreateUserInvitationInput &
  IOrganizationData & { invitedByUserId?: string };

@Injectable()
export class CreateUserInvitationUseCase
  implements IBaseUseCase<CreateUserInvitationUseCaseInput, InvitationObject>
{
  private readonly invitationTemplatePath: string;

  constructor(
    private emailService: EmailService,
    private userDataSource: UserDataSource,
    private invitationDataSource: InvitationDataSource,
  ) {
    this.invitationTemplatePath = join(
      process.cwd(),
      'src',
      'shared',
      'templates',
      'user-invitation.pug',
    );
  }

  async execute(
    input: CreateUserInvitationUseCaseInput,
  ): Promise<InvitationObject> {
    const { email, roles, organizationId, invitedByUserId } = input;

    const userExists = await this.userDataSource.findByEmail(email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const pendingInvitation =
      await this.invitationDataSource.findPendingByOrgAndEmail(
        organizationId,
        email,
      );

    if (pendingInvitation) {
      throw new InvitationAlreadyPendingError();
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRATION_MS);

    const invitation = await this.invitationDataSource.createOne({
      organizationId,
      email,
      roles,
      token,
      status: InvitationStatus.PENDING,
      expiresAt,
      invitedByUserId,
    });

    const invitationUrl = `${Environment.frontendUrl}/accept-invitation?token=${token}`;

    await this.emailService.sendMail({
      to: email,
      subject: 'Você foi convidado para o Chefin!',
      html: renderFile(this.invitationTemplatePath, { invitationUrl }),
    });

    return invitation;
  }
}
