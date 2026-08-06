import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MenuObj } from './usecases/dto/menu.object';
import { CreateMenuUseCase } from './usecases/create-menu.usecase';
import { CreateMenuInput } from './usecases/dto/create-menu.input';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { GetLocationMenusUseCase } from './usecases/get-menu.usecase';
import { MenuWithCategoriesObj } from './usecases/dto/menu-with-categories.object';
import { GetMenuDetailsUseCase } from './usecases/get-menu-details.usecase';
import { UpdateMenuUseCase } from './usecases/update-menu.usecase';
import { GetMenuDetailsInput } from './usecases/dto/get-menu-details.input';
import { MenuDetailsObj } from './usecases/dto/menu-details.object';
import { UpdateMenuInput } from './usecases/dto/update-menu.input';

@Resolver()
export class MenuResolver {
  constructor(
    private createMenuUseCase: CreateMenuUseCase,
    private getLocationMenusUseCase: GetLocationMenusUseCase,
    private getMenuDetailsUseCase: GetMenuDetailsUseCase,
    private updateMenuUseCase: UpdateMenuUseCase,
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

  @UseGuards(AuthGuard)
  @Query(() => MenuDetailsObj)
  async getMenuDetails(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: GetMenuDetailsInput,
  ): Promise<MenuDetailsObj> {
    return this.getMenuDetailsUseCase.execute({
      ...input,
      ...user,
    });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MenuObj)
  async updateMenu(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateMenuInput,
  ): Promise<MenuObj> {
    return this.updateMenuUseCase.execute({
      ...input,
      ...user,
    });
  }

  // Recebe organizationId e menuId
  // async getPublicMenu() {}
}
