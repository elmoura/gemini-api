import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { InvitationDataSource } from '../datasources/invitation.datasource';
import { InvitationStatus } from '../entities/invitation';
import { CancelInvitationInput } from './dto/cancel-invitation.input';
import { InvitationObject } from './dto/invitation.object';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';

@Injectable()
export class CancelInvitationUseCase
  implements
    IBaseUseCase<CancelInvitationInput & IOrganizationData, InvitationObject>
{
  constructor(private invitationDataSource: InvitationDataSource) {}

  async execute(
    input: CancelInvitationInput & IOrganizationData,
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

    return this.invitationDataSource.updateOne(invitationId, {
      status: InvitationStatus.CANCELLED,
    });
  }
}
