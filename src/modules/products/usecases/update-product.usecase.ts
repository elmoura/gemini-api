import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductObj } from './dto/product.object';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ProductNotFoundException } from '@modules/products/errors/product-not-found.exception';
import { ProductComplementGroupsValidation } from '@modules/products/validations/product-complement-groups.validation';
import { MoveProductImageUtil } from '../utils/move-product-images-util';

@Injectable()
export class UpdateProductUsecase
  implements IBaseUseCase<UpdateProductInput, ProductObj>
{
  constructor(
    private productDataSource: ProductDataSource,
    private moveProductImageUtil: MoveProductImageUtil,
    private productComplementGroupsValidation: ProductComplementGroupsValidation,
  ) {}

  async execute(input: UpdateProductInput): Promise<ProductObj> {
    const { _id: productId, organizationId, locationId } = input;

    const productExists = await this.productDataSource.findById(productId);

    if (
      !productExists ||
      (productExists && productExists.organizationId !== organizationId)
    ) {
      throw new ProductNotFoundException(input._id);
    }

    if (input.complementGroups !== undefined && input.complementGroups.length > 0) {
      await this.productComplementGroupsValidation.execute({
        organizationId,
        locationId,
        complementGroups: input.complementGroups,
      });
    }

    let images: ProductObj['images'] | undefined;
    if (input.images !== undefined) {
      if (input.images.length > 0) {
        images = await this.moveProductImageUtil.execute({
          productId,
          organizationId: input.organizationId,
          images: input.images,
        });
      } else {
        images = [];
      }
    }

    await this.productDataSource.updateOne(
      { productId, organizationId, locationId },
      {
        ...input,
        images,
      },
    );

    return this.productDataSource.findById(productId);
  }
}
