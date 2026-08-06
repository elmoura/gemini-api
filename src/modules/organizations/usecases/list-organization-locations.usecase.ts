import { ForbiddenException, Injectable } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { ListOrganizationLocationsInput } from './types/list-organization-locations.input';
import { OrganizationLocation } from '../entities/organization-location';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { OrganizationLocationDataSource } from '../datasources/organization-location.datasource';
import { OrganizationNotFoundException } from '../errors/organization-not-found.exception';

@Injectable()
export class ListOrganizationLocationsUseCase {
  constructor(
    private organizationDataSource: OrganizationDataSource,
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute(
    { organizationId }: ListOrganizationLocationsInput,
    currentUser: CurrentUserData,
  ): Promise<OrganizationLocation[]> {
    if (currentUser.organizationId !== organizationId) {
      throw new ForbiddenException();
    }

    const organization = await this.organizationDataSource.findById(
      organizationId,
    );

    if (!organization) throw new OrganizationNotFoundException();

    return this.organizationLocationDataSource.findLocationsByOrgId(
      organizationId,
    );
  }
}
