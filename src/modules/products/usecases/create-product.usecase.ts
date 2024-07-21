import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { ProductDataSource } from '../datasources/product.datasource';
import { ProductObj } from './dto/product.object';
import { CreateProductInput } from './dto/create-product.input';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { ProductCategoryDataSource } from '../datasources/product-category.datasource';
import { ProductCategory } from '../entities/product-category';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';

@Injectable()
export class CreateProductUseCase
  implements IBaseUseCase<CreateProductInput & IOrganizationData, ProductObj>
{
  constructor(
    private productDataSource: ProductDataSource,
    private categoryDataSoruce: CategoryDataSource,
    private organizationDataSource: OrganizationDataSource,
    private productCategoryDataSource: ProductCategoryDataSource,
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

    const createdProduct = await this.productDataSource.createOne(input);

    let createdProductCategories = [];

    if (input?.categoryIds?.length > 0) {
      createdProductCategories = await Promise.all(
        input.categoryIds.map(async (categoryId) =>
          this.createProductCategory({
            categoryId,
            productId: createdProduct._id,
            organizationId: input.organizationId,
          }),
        ),
      );

      createdProductCategories = createdProductCategories.filter(
        (productCategory) => productCategory,
      );
    }

    return {
      ...createdProduct,
      categories: createdProductCategories,
    };
  }

  async createProductCategory(data: {
    productId: string;
    categoryId: string;
    organizationId: string;
  }): Promise<ProductCategory | false> {
    const { categoryId, organizationId, productId } = data;

    const categoryExists = this.categoryDataSoruce.findById(categoryId);

    if (!categoryExists) return false;

    return this.productCategoryDataSource.createOne({
      categoryId,
      organizationId,
      productId,
    });
  }
}
