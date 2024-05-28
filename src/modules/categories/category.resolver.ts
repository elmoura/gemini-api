import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryObj } from './usecases/types/category.object';
import { CreateCategoryInput } from './usecases/types/create-category.input';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { ListCategoriesOutput } from './usecases/types/list-categories.output';
import { ListCategoriesInput } from './usecases/types/list-categories.input';
import { ListCategoriesUseCase } from './usecases/list-categories.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class CategoryResolver {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

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

  @Query(() => ListCategoriesOutput)
  listCategories(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ListCategoriesInput,
  ): Promise<ListCategoriesOutput> {
    return this.listCategoriesUseCase.execute({
      ...input,
      organizationId: user.organizationId,
    });
  }
}
