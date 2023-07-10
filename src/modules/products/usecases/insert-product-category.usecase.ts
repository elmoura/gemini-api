import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { InsertProductCategoryInput } from './dto/insert-product-category.input';
import { InsertProductCategoryOutput } from './dto/insert-product-category.output';
import { ProductCategoryDataSource } from '../datasources/product-category.datasource';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { ProductDataSource } from '../datasources/product.datasource';
import { IOrganizationData } from '@shared/interfaces/organization-data';

@Injectable()
export class InsertProductCategoryUseCase
  implements
    IBaseUseCase<
      InsertProductCategoryInput & IOrganizationData,
      InsertProductCategoryOutput
    >
{
  constructor(
    private productDataSource: ProductDataSource,
    private categoryDataSource: CategoryDataSource,
    private productCategoryDataSource: ProductCategoryDataSource,
  ) {}

  async execute(
    input: InsertProductCategoryInput & IOrganizationData,
  ): Promise<InsertProductCategoryOutput> {
    return this.productCategoryDataSource.createOne(input);
  }
}
