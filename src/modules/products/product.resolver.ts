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

@Resolver()
export class ProductResolver {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
  ) {}

  @Mutation(() => ProductObj)
  @UseGuards(AuthGuard)
  async createProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductObj> {
    const { organizationId } = user;
    return this.createProductUseCase.execute({ organizationId, ...input });
  }

  @Query(() => ListProductsOutput)
  @UseGuards(AuthGuard)
  async listProducts(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ListProductsInput,
  ): Promise<ListProductsOutput> {
    const { organizationId } = user;
    return this.listProductsUseCase.execute({ organizationId, ...input });
  }
}
