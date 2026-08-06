import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ProductDataSource } from '../datasources/product.datasource';
import { SearchProductInput } from './dto/search-product.input';
import { SearchProductResultObject } from './dto/search-product-result.object';

type SearchProductParams = SearchProductInput & {
  organizationId: string;
  locationId: string;
};

@Injectable()
export class SearchProductUseCase
  implements IBaseUseCase<SearchProductParams, SearchProductResultObject>
{
  constructor(private productDataSource: ProductDataSource) {}

  async execute(params: SearchProductParams): Promise<SearchProductResultObject> {
    const { name, organizationId, locationId, limit = 20, offset = 0 } = params;

    const searchRegex = new RegExp(name, 'i');

    const products = await this.productDataSource.searchByName(
      {
        name: searchRegex,
        organizationId,
        locationId,
      },
      { limit, offset },
    );

    return {
      offset,
      limit,
      count: products.length,
      data: products,
    };
  }
}
