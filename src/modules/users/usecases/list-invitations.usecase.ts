import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { InvitationDataSource } from '../datasources/invitation.datasource';
import { InvitationStatus } from '../entities/invitation';
import { ListInvitationsInput } from './dto/list-invitations.input';
import { InvitationObject } from './dto/invitation.object';

@Injectable()
export class ListInvitationsUseCase
  implements
    IBaseUseCase<ListInvitationsInput & IOrganizationData, InvitationObject[]>
{
  constructor(private invitationDataSource: InvitationDataSource) {}

  async execute(
    input: ListInvitationsInput & IOrganizationData,
  ): Promise<InvitationObject[]> {
    const { organizationId, status = InvitationStatus.PENDING } = input;

    return this.invitationDataSource.listByOrganization(organizationId, status);
  }
}
