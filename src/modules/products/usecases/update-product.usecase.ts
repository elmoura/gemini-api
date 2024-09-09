import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductObj } from './dto/product.object';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ProductNotFoundException } from '@modules/products/errors/product-not-found.exception';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';

@Injectable()
export class UpdateProductUsecase
  implements IBaseUseCase<UpdateProductInput, ProductObj>
{
  constructor(
    private productDataSource: ProductDataSource,
    private categoryDataSource: CategoryDataSource,
  ) {}

  async execute(input: UpdateProductInput): Promise<ProductObj> {
    const { _id: productId, organizationId } = input;

    const productExists = await this.productDataSource.findById(productId);

    if (
      !productExists ||
      (productExists && productExists.organizationId !== organizationId)
    ) {
      throw new ProductNotFoundException(input._id);
    }

    await this.productDataSource.updateOne(
      { productId, organizationId },
      input,
    );

    return this.productDataSource.findById(productId);
  }
}
