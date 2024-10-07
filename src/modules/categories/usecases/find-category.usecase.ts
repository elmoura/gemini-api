import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CategoryDataSource } from '../datasources/category.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { FindCategoryInput } from './types/find-category.input';
import { CategoryObj } from './types/category.object';
import { CategoryNotFoundException } from '../errors/category-not-found.exception';
import { objectIdArrayToStrings } from '@shared/utils/to-object-id';

@Injectable()
export class FindCategoryUseCase
  implements IBaseUseCase<FindCategoryInput, CategoryObj>
{
  constructor(
    private categoriesDataSource: CategoryDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute(input: FindCategoryInput): Promise<CategoryObj> {
    const { _id, organizationId, locationId } = input;

    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new OrganizationNotFoundException();

    const category = await this.categoriesDataSource.findById({
      _id,
      locationId,
      organizationId,
    });

    if (!category || category.organizationId !== input.organizationId) {
      throw new CategoryNotFoundException(_id);
    }

    return {
      ...category,
      productIds: objectIdArrayToStrings(category.productIds),
    };
  }
}
