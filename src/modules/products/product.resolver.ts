import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { ProductObj } from './usecases/dto/product.object';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { CreateProductInput } from './usecases/dto/create-product.input';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { ListProductsUseCase } from './usecases/list-products.usecase';
import { ListProductsOutput } from './usecases/dto/list-products.output';
import { ListProductsInput } from './usecases/dto/list-products.input';
import { UpdateProductUsecase } from './usecases/update-product.usecase';
import { UpdateProductInput } from './usecases/dto/update-product.input';
import { SearchProductUseCase } from './usecases/search-product.usecase';
import { SearchProductInput } from './usecases/dto/search-product.input';
import { SearchProductResultObject } from './usecases/dto/search-product-result.object';
import { FindProductUseCase } from './usecases/find-product.usecase';
import { FindProductInput } from './usecases/dto/find-product.input';

@Resolver()
@UseGuards(AuthGuard)
export class ProductResolver {
  constructor(
    private listProductsUseCase: ListProductsUseCase,
    private updateProductUseCase: UpdateProductUsecase,
    private createProductUseCase: CreateProductUseCase,
    private searchProductUseCase: SearchProductUseCase,
    private findProductUseCase: FindProductUseCase,
  ) {}

  @Mutation(() => ProductObj)
  async createProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductObj> {
    return this.createProductUseCase.execute({ ...user, ...input });
  }

  @Query(() => ListProductsOutput)
  async listProducts(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ListProductsInput,
  ): Promise<ListProductsOutput> {
    const { organizationId, locationId } = user;
    return this.listProductsUseCase.execute({ organizationId, locationId, ...input });
  }

  @Mutation(() => ProductObj)
  async updateProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductObj> {
    return this.updateProductUseCase.execute({
      ...input,
      organizationId: user.organizationId,
      locationId: user.locationId,
    });
  }

  @Query(() => ProductObj)
  async findProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: FindProductInput,
  ): Promise<ProductObj> {
    return this.findProductUseCase.execute({ ...input, ...user });
  }

  @Query(() => SearchProductResultObject)
  async searchProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: SearchProductInput,
  ): Promise<SearchProductResultObject> {
    return this.searchProductUseCase.execute({
      ...input,
      ...user,
    });
  }
}
