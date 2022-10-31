import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { Organization } from '../entities/organization';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { CreateOrganizationInput } from './types/create-organization.input';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';

@Injectable()
export class CreateOrganizationUseCase
  implements IBaseUseCase<CreateOrganizationInput, Organization>
{
  constructor(
    private readonly organizationDataSource: OrganizationDataSource,
    private readonly createUserInvitationUseCase: CreateUserInvitationUseCase,
  ) {}

  async execute(input: CreateOrganizationInput): Promise<Organization> {
    const organization = await this.organizationDataSource.createOne(input);
    const organizationId = organization._id;

    const businessRepresentantData =
      await this.createUserInvitationUseCase.execute({
        organizationId,
        email: input.representantEmail,
      });

    const businessRepresentantId = businessRepresentantData._id;

    this.organizationDataSource.updateOne(organizationId, {
      businessRepresentantId,
    });

    return {
      ...organization,
      businessRepresentantId,
    };
  }
}
