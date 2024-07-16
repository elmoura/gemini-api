import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { ProductDataSource } from '../datasources/product.datasource';
import { ProductObj } from './dto/product.object';
import { CreateProductInput } from './dto/create-product.input';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { CategoryNotFoundException } from '../errors/category-not-found.exception';

@Injectable()
export class CreateProductUseCase
  implements IBaseUseCase<CreateProductInput & IOrganizationData, ProductObj>
{
  constructor(
    private productDataSource: ProductDataSource,
    private categoryDataSoruce: CategoryDataSource,
    private organizationDataSource: OrganizationDataSource,
  ) {}

  async execute(
    input: CreateProductInput & IOrganizationData,
  ): Promise<ProductObj> {
    const organizationExists = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    const { categoryId } = input;

    if (categoryId) {
      const categoryExists = await this.categoryDataSoruce.findById(categoryId);

      if (!categoryExists) throw new CategoryNotFoundException(categoryId);
    }

    const createdProduct = await this.productDataSource.createOne(input);

    return createdProduct;
  }
}
