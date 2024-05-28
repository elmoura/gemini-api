import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { CategoryDataSource } from '../datasources/category.datasource';
import { CreateCategoryInput } from './types/create-category.input';
import { CategoryObj } from './types/category.object';
import { IOrganizationData } from '@shared/interfaces/organization-data';

@Injectable()
export class CreateCategoryUseCase
  implements IBaseUseCase<CreateCategoryInput & IOrganizationData, CategoryObj>
{
  constructor(
    private categoryDataSource: CategoryDataSource,
    private organizationDataSource: OrganizationDataSource,
  ) {}

  async execute(
    input: CreateCategoryInput & IOrganizationData,
  ): Promise<CategoryObj> {
    const organizationExists = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    return this.categoryDataSource.createOne(input);
  }
}
