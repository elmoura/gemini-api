import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ProductImageDataSource } from '../datasources/product-image.datasource';
import { ProductImageFileDataSource } from '../datasources/product-image-file.datasource';
import { UploadProductImagesInput } from './dto/upload-product-images.input';
import { ProductDataSource } from '../datasources/product.datasource';
import { ProductDontExistError } from './errors/product-dont-exist';
import { UploadProductImagesOutput } from './dto/upload-product-image.output';

/**
 * @observation
 * How to implement it:
 * https://www.elbarryamine.com/blog/how-to-upload-files-with-nest-js-and-graphql
 */
@Injectable()
export class UploadProductImagesUseCase
  implements IBaseUseCase<UploadProductImagesInput, UploadProductImagesOutput>
{
  constructor(
    private productDataSource: ProductDataSource,
    private productImageDataSource: ProductImageDataSource,
    private productImageFileDataSource: ProductImageFileDataSource,
  ) {}

  async execute(
    input: UploadProductImagesInput,
  ): Promise<UploadProductImagesOutput> {
    const { productId, organizationId } = input;

    const productExists = await this.productDataSource.findById(productId);

    if (!productExists) {
      throw new ProductDontExistError(productId);
    }

    const createdImages = await Promise.all(
      input.files.map(async (file, index) => {
        const fileKey = this.createFileKey({
          productId,
          organizationId,
          index,
          fileExtension: 'jpg',
        });

        const { url } = await this.productImageFileDataSource.uploadOne(
          fileKey,
          file,
        );

        const fileName = fileKey.split('/')[2];

        return this.productImageDataSource.createOne({
          url,
          productId,
          fileName,
        });
      }),
    );

    return { results: createdImages };
  }

  createFileKey(data: {
    productId: string;
    organizationId: string;
    index: number;
    fileExtension: string;
  }): string {
    return `${data.organizationId}/products/${data.productId}-${data.index}.${data.fileExtension}`;
  }
}
