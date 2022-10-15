import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { Organization } from '../entities/organization';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { CreateOrganizationInput } from './types/create-organization.input';

@Injectable()
export class CreateOrganizationUseCase
  implements IBaseUseCase<CreateOrganizationInput, Organization>
{
  constructor(
    private readonly organizationDataSource: OrganizationDataSource,
  ) {}

  execute(input: CreateOrganizationInput): Promise<Organization> {
    return this.organizationDataSource.createOne(input);
    // precisa criar o usuario e atualizar o businessRepresentantId dentro de Org
  }
}
