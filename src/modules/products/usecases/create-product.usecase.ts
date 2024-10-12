import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ProductDataSource } from '../datasources/product.datasource';
import { ProductObj } from './dto/product.object';
import { CreateProductInput } from './dto/create-product.input';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { MoveProductImageUtil } from '../utils/move-product-images-util';
import { UploadService } from '@shared/services/upload.service';

@Injectable()
export class CreateProductUseCase
  implements IBaseUseCase<CreateProductInput, ProductObj>
{
  constructor(
    private uploadService: UploadService,
    private productDataSource: ProductDataSource,
    private organizationDataSource: OrganizationDataSource,
    private moveProductImageUtil: MoveProductImageUtil,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductObj> {
    const organizationExists = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    const createdProduct = await this.productDataSource.createOne({
      ...input,
      images: [],
    });

    const productId = createdProduct._id;

    const images = await this.moveProductImageUtil.execute({
      productId,
      organizationId: input.organizationId,
      images: input.images,
    });

    await this.productDataSource.updateOne(
      { organizationId: input.organizationId, productId },
      { images },
    );

    return this.productDataSource.findById(productId);
  }
}
