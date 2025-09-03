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
import { FindCategoryInput } from './usecases/types/find-category.input';
import { FindCategoryUseCase } from './usecases/find-category.usecase';
import { UpdateCategoryUseCase } from './usecases/update-category.usecase';
import { UpdateCategoryInput } from './usecases/types/update-category.input';
import { SearchCategoryUseCase } from './usecases/search-category.usecase';
import { SearchCategoryInput } from './usecases/types/search-category.input';
import { SearchCategoryResultObject } from './usecases/types/search-category-result.object';

@Resolver()
@UseGuards(AuthGuard)
export class CategoryResolver {
  constructor(
    private createCategoryUseCase: CreateCategoryUseCase,
    private listCategoriesUseCase: ListCategoriesUseCase,
    private findCategoryUseCase: FindCategoryUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private searchCategoryUseCase: SearchCategoryUseCase,
  ) {}

  @Mutation(() => CategoryObj)
  async createCategory(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateCategoryInput,
  ): Promise<CategoryObj> {
    return this.createCategoryUseCase.execute({
      ...input,
      ...user,
    });
  }

  @Query(() => ListCategoriesOutput)
  listCategories(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ListCategoriesInput,
  ): Promise<ListCategoriesOutput> {
    return this.listCategoriesUseCase.execute({
      ...input,
      ...user,
    });
  }

  @Query(() => CategoryObj)
  async findCategory(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: FindCategoryInput,
  ): Promise<CategoryObj> {
    return this.findCategoryUseCase.execute({
      ...input,
      ...user,
    });
  }

  @Mutation(() => CategoryObj)
  async updateCategory(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateCategoryInput,
  ): Promise<CategoryObj> {
    return this.updateCategoryUseCase.execute({
      ...input,
      ...user,
    });
  }

  @Query(() => SearchCategoryResultObject)
  async searchCategory(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: SearchCategoryInput,
  ): Promise<SearchCategoryResultObject> {
    return this.searchCategoryUseCase.execute({
      ...input,
      ...user,
    });
  }
}
