import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@shared/guards/auth.guard';
import { ProductObj } from './usecases/dto/product.object';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { CreateProductInput } from './usecases/dto/create-product.input';
import { CreateProductUseCase } from './usecases/create-product.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class ProductResolver {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Mutation(() => CreateProductInput)
  async createProduct(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateProductInput,
  ): Promise<ProductObj> {
    const { organizationId } = user;
    return this.createProductUseCase.execute({ organizationId, ...input });
  }
}
