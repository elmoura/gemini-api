import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationLocationDataSource } from '../datasources/organization-location.datasource';
import { OrganizationLocationExistsInput } from './types/organization-location-exists.input';

@Injectable()
export class OrganizationLocationExistsUseCase
  implements IBaseUseCase<OrganizationLocationExistsInput, boolean>
{
  constructor(
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute({
    organizationId,
    locationId,
  }: OrganizationLocationExistsInput): Promise<boolean> {
    const location =
      await this.organizationLocationDataSource.findByOrgAndLocationId(
        organizationId,
        locationId,
      );

    return Boolean(location);
  }
}
