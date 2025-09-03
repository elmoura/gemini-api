import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CategoryDataSource } from '../datasources/category.datasource';
import { SearchCategoryInput } from './types/search-category.input';
import { objectIdArrayToStrings } from '@shared/utils/to-object-id';
import { SearchCategoryResultObject } from './types/search-category-result.object';

type SearchCategoryParams = SearchCategoryInput & {
  organizationId: string;
  locationId: string;
};

@Injectable()
export class SearchCategoryUseCase
  implements IBaseUseCase<SearchCategoryParams, SearchCategoryResultObject>
{
  constructor(private categoryDataSource: CategoryDataSource) {}

  async execute(
    params: SearchCategoryParams,
  ): Promise<SearchCategoryResultObject> {
    const { name, organizationId, locationId, limit = 20, offset = 0 } = params;

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(name, 'i');

    // Search categories by name within the organization and location
    const categories = await this.categoryDataSource.searchByName(
      {
        name: searchRegex,
        organizationId,
        locationId,
      },
      { limit, offset },
    );

    // Convert ObjectIds to strings for GraphQL
    const categoriesWithStringIds = categories.map((category) => ({
      ...category,
      productIds: objectIdArrayToStrings(category.productIds),
    }));

    return {
      offset,
      limit,
      count: categoriesWithStringIds.length,
      data: categoriesWithStringIds,
    };
  }
}
