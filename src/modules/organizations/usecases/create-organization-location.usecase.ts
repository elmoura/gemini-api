import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateOrganizationLocationInput } from './types/create-organization-location.input';
import { OrganizationLocationObj } from './types/organization-location.object';
import { OrganizationLocationDataSource } from '../datasources/organization-location.datasource';

@Injectable()
export class CreateOrganizationLocationUseCase
  implements
    IBaseUseCase<CreateOrganizationLocationInput, OrganizationLocationObj>
{
  constructor(
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute(
    input: CreateOrganizationLocationInput,
  ): Promise<OrganizationLocationObj> {
    const result = await this.organizationLocationDataSource.createOne(input);
    return result;
  }
}
