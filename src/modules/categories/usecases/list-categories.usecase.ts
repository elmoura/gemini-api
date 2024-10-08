import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ListCategoriesOutput } from './types/list-categories.output';
import { CategoryDataSource } from '../datasources/category.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { ListCategoriesInput } from './types/list-categories.input';

@Injectable()
export class ListCategoriesUseCase
  implements IBaseUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(
    private categoriesDataSource: CategoryDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute({
    locationId,
    organizationId,
    limit = 20,
    offset = 0,
  }: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new OrganizationNotFoundException();

    const categories = await this.categoriesDataSource.listByOrganization(
      { organizationId, locationId },
      { limit, offset },
    );

    return {
      limit,
      offset,
      count: categories.length,
      data: categories,
    };
  }
}
