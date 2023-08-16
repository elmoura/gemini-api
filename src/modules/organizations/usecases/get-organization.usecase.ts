import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetOrganizationInput } from './types/get-organization.input';
import { Organization } from '../entities/organization';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { OrganizationLocationDataSource } from '../datasources/organization-location.datasource';
import { CurrentUserData } from '@shared/decorators/current-user';

@Injectable()
export class GetOrganizationUseCase {
  constructor(
    private readonly organizationDataSource: OrganizationDataSource,
    private readonly organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute(
    { organizationId }: GetOrganizationInput,
    currentUser: CurrentUserData,
  ): Promise<Organization> {
    const isUserFromOrganization =
      currentUser.organizationId === organizationId;

    if (!isUserFromOrganization) throw new ForbiddenException();

    const organization = await this.organizationDataSource.findById(
      organizationId,
    );

    if (!organization) throw new ForbiddenException();

    const locations =
      await this.organizationLocationDataSource.findLocationsByOrgId(
        organizationId,
      );

    return {
      ...organization,
      locations,
    };
  }
}
