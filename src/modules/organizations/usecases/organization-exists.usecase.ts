import { Injectable } from '@nestjs/common';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationExistsInput } from './types/organization-exists.input';

@Injectable()
export class OrganizationExistsUseCase
  implements IBaseUseCase<OrganizationExistsInput, boolean>
{
  constructor(private organizationDataSource: OrganizationDataSource) {}

  async execute({ organizationId }: OrganizationExistsInput): Promise<boolean> {
    const organization = this.organizationDataSource.findById(organizationId);

    return Boolean(organization);
  }
}
