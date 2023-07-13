import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryObj } from './usecases/dto/category.object';
import { CreateCategoryInput } from './usecases/dto/create-category.input';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';

@Resolver()
export class CategoryResolver {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CategoryObj)
  async createCategory(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryObj> {
    return this.createCategoryUseCase.execute({
      organizationId: user.organizationId,
      ...input,
    });
  }
}
