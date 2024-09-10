import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MenuObj } from './usecases/dto/menu.object';
import { CreateMenuUseCase } from './usecases/create-menu.usecase';
import { CreateMenuInput } from './usecases/dto/create-menu.input';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';

@Resolver()
export class MenuResolver {
  constructor(private createMenuUseCase: CreateMenuUseCase) {}

  @UseGuards(AuthGuard)
  @Mutation(() => MenuObj)
  async createMenu(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateMenuInput,
  ): Promise<MenuObj> {
    console.log({ user });

    return this.createMenuUseCase.execute({
      ...input,
      ...user,
    });
  }
}
