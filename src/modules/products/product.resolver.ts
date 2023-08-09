import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { ProductObj } from './usecases/dto/product.object';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { CreateProductInput } from './usecases/dto/create-product.input';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { UploadProductImagesOutput } from './usecases/dto/upload-product-image.output';
import { UploadProductImagesUseCase } from './usecases/upload-product-images.usecase';
import { UploadProductImagesInput } from './usecases/dto/upload-product-images.input';

@Resolver()
@UseGuards(AuthGuard)
export class ProductResolver {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private uploadProductImagesUseCase: UploadProductImagesUseCase,
  ) {}

  @Mutation(() => ProductObj)
  async createProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductObj> {
    const { organizationId } = user;
    return this.createProductUseCase.execute({ organizationId, ...input });
  }

  @Mutation(() => UploadProductImagesOutput)
  uploadProductImages(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UploadProductImagesInput,
  ): Promise<UploadProductImagesOutput> {
    return this.uploadProductImagesUseCase.execute({
      organizationId: user.organizationId,
      ...input,
    });
  }
}
