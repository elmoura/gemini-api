import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductObj } from './dto/product.object';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { ProductNotFoundException } from '@modules/products/errors/product-not-found.exception';
import { MoveProductImageUtil } from '../utils/move-product-images-util';

@Injectable()
export class UpdateProductUsecase
  implements IBaseUseCase<UpdateProductInput, ProductObj>
{
  constructor(
    private productDataSource: ProductDataSource,
    private moveProductImageUtil: MoveProductImageUtil,
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

    // sempre mandar todo array de imagens na ordem certa
    let images = [];
    if (input?.images?.length) {
      images = await this.moveProductImageUtil.execute({
        productId,
        organizationId: input.organizationId,
        images: input.images,
      });
    }

    await this.productDataSource.updateOne(
      { productId, organizationId, locationId },
      { ...input, images: input?.images?.length ? images : undefined },
    );

    return this.productDataSource.findById(productId);
  }
}
