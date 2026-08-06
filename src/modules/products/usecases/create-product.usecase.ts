import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ProductDataSource } from '../datasources/product.datasource';
import { ProductObj } from './dto/product.object';
import { CreateProductInput } from './dto/create-product.input';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { MoveProductImageUtil } from '../utils/move-product-images-util';
import { UploadService } from '@shared/services/upload.service';
import { ProductComplementGroupsValidation } from '../validations/product-complement-groups.validation';

@Injectable()
export class CreateProductUseCase
  implements IBaseUseCase<CreateProductInput, ProductObj>
{
  constructor(
    private uploadService: UploadService,
    private productDataSource: ProductDataSource,
    private organizationDataSource: OrganizationDataSource,
    private moveProductImageUtil: MoveProductImageUtil,
    private productComplementGroupsValidation: ProductComplementGroupsValidation,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductObj> {
    const { organizationId, locationId } = input;

    const organizationExists = await this.organizationDataSource.findById(
      organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    if (input.complementGroups?.length) {
      await this.productComplementGroupsValidation.execute({
        organizationId,
        locationId,
        complementGroups: input.complementGroups,
      });
    }

    const createdProduct = await this.productDataSource.createOne({
      ...input,
      complementGroups: input.complementGroups ?? [],
      images: [],
    });

    const productId = createdProduct._id;

    if (input?.images?.length) {
      const images = await this.moveProductImageUtil.execute({
        productId,
        organizationId: input.organizationId,
        images: input.images,
      });

      await this.productDataSource.updateOne(
        { organizationId, locationId, productId },
        { images },
      );
    }

    return this.productDataSource.findById(productId);
  }
}
