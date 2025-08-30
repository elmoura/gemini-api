import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MenuObj } from './usecases/dto/menu.object';
import { CreateMenuUseCase } from './usecases/create-menu.usecase';
import { CreateMenuInput } from './usecases/dto/create-menu.input';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { GetLocationMenusUseCase } from './usecases/get-menu.usecase';
import { MenuWithCategoriesObj } from './usecases/dto/menu-with-categories.object';

@Resolver()
export class MenuResolver {
  constructor(
    private createMenuUseCase: CreateMenuUseCase,
    private getLocationMenusUseCase: GetLocationMenusUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => MenuObj)
  async createMenu(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateMenuInput,
  ): Promise<MenuObj> {
    return this.createMenuUseCase.execute({
      ...input,
      ...user,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [MenuObj])
  async getLocationMenus(
    @CurrentUser() user: CurrentUserData,
  ): Promise<MenuWithCategoriesObj[]> {
    return this.getLocationMenusUseCase.execute({
      ...user,
    });
  }

  // Recebe organizationId e menuId
  // async getPublicMenu() {}
}
