import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { ListProductsInput } from './dto/list-products.input';
import { ListProductsOutput } from './dto/list-products.output';
import { ProductDataSource } from '../datasources/product.datasource';

@Injectable()
export class ListProductsUseCase
  implements IBaseUseCase<ListProductsInput, ListProductsOutput>
{
  constructor(
    private productDataSource: ProductDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute({
    locationId,
    organizationId,
    limit = 20,
    offset = 0,
  }: ListProductsInput): Promise<ListProductsOutput> {
    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new OrganizationNotFoundException();

    const products = await this.productDataSource.listByOrganization(
      { organizationId, locationId },
      { limit, offset },
    );

    return {
      limit,
      offset,
      count: products.length,
      data: products,
    };
  }
}
