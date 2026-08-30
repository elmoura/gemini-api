import { join } from 'path';
import { randomBytes } from 'crypto';
import { renderFile } from 'pug';
import { Injectable } from '@nestjs/common';
import { Environment } from '@config/env';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { EmailService } from '@shared/services/email.service';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { InvitationDataSource } from '../datasources/invitation.datasource';
import { InvitationStatus } from '../entities/invitation';
import { ResendInvitationInput } from './dto/resend-invitation.input';
import { InvitationObject } from './dto/invitation.object';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';
import { InvitationExpiredError } from '../errors/invitation-expired';

const INVITATION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ResendInvitationUseCase
  implements
    IBaseUseCase<ResendInvitationInput & IOrganizationData, InvitationObject>
{
  private readonly invitationTemplatePath: string;

  constructor(
    private emailService: EmailService,
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
    input: ResendInvitationInput & IOrganizationData,
  ): Promise<InvitationObject> {
    const { invitationId, organizationId } = input;

    const invitation = await this.invitationDataSource.findById(
      invitationId,
      organizationId,
    );

    if (!invitation) {
      throw new InvitationNotFoundError();
    }

    if (invitation.status === InvitationStatus.CANCELLED) {
      throw new InvitationCancelledError();
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new InvitationAlreadyUsedError();
    }

    if (invitation.status === InvitationStatus.EXPIRED) {
      throw new InvitationExpiredError();
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITATION_EXPIRATION_MS);

    const updatedInvitation = await this.invitationDataSource.updateOne(
      invitationId,
      { token, expiresAt },
    );

    const invitationUrl = `${Environment.frontendUrl}/accept-invitation?token=${token}`;

    await this.emailService.sendMail({
      to: invitation.email,
      subject: 'Você foi convidado para o Chefin!',
      html: renderFile(this.invitationTemplatePath, { invitationUrl }),
    });

    return updatedInvitation;
  }
}
