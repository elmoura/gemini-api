import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ListOrganizationLocationsInput } from './types/list-organization-locations.input';
import { OrganizationLocation } from '../entities/organization-location';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { OrganizationLocationDataSource } from '../datasources/organization-location.datasource';
import { OrganizationNotFoundException } from '../errors/organization-not-found.exception';

@Injectable()
export class ListOrganizationLocationsUseCase
  implements
    IBaseUseCase<ListOrganizationLocationsInput, OrganizationLocation[]>
{
  constructor(
    private organizationDataSource: OrganizationDataSource,
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute({
    organizationId,
  }: ListOrganizationLocationsInput): Promise<OrganizationLocation[]> {
    const organization = await this.organizationDataSource.findById(
      organizationId,
    );

    if (!organization) throw new OrganizationNotFoundException();

    const locations =
      await this.organizationLocationDataSource.findLocationsByOrgId(
        organizationId,
      );

    return locations;
  }
}
