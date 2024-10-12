import { Injectable } from '@nestjs/common';
import { ProductImage } from '../entities/product';
import { ProductImageInput } from '../usecases/dto/create-product.input';
import { Buckets, UploadService } from '@shared/services/upload.service';

type Params = {
  organizationId: string;
  productId: string;
  images: ProductImageInput[];
};

@Injectable()
export class MoveProductImageUtil {
  constructor(private uploadService: UploadService) {}

  public async execute(input: Params): Promise<ProductImage[]> {
    const uploadedImages = await Promise.all(
      input.images.map((image, index) => {
        const isTempImage = this.isTempImageUrl(
          input.organizationId,
          image.url,
        );

        if (isTempImage) {
          const fromKey = this.uploadService.getFileKeyFromUrl(image.url).key;

          const splittedFromKey = fromKey.split('.');
          const fileExtension = splittedFromKey[splittedFromKey.length - 1];
          const toKey = `${input.organizationId}/products/${input.productId}/${index}.${fileExtension}`;

          return this.uploadService.moveFile({
            toKey,
            fromKey,
            fromBucket: Buckets.files,
            toBucket: Buckets.files,
          });
        }
      }),
    );

    return uploadedImages
      .filter((item) => item)
      .map(
        (item): ProductImage => ({
          url: item.newUrl,
        }),
      );
  }

  public isTempImageUrl(organizationId: string, url: string): boolean {
    return url.includes(`${organizationId}/tmp`);
  }
}
