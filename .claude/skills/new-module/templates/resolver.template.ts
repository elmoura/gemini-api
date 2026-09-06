// Template: __module-folder-singular__.resolver.ts
// Resolver magro: só extrai @CurrentUser()/@Args('input') e delega ao usecase.
// Para adicionar find/list/update depois (via skill new-usecase), replicar este
// mesmo formato de método — nunca acessar datasource/Mongoose aqui.
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { Create__EntityName__UseCase } from './usecases/create-__entity-name__.usecase';
import { Create__EntityName__Input } from './usecases/dto/create-__entity-name__.input';
import { __EntityName__Obj } from './usecases/dto/__entity-name__.object';

@Resolver()
@UseGuards(AuthGuard)
export class __EntityName__Resolver {
  constructor(private create__EntityName__UseCase: Create__EntityName__UseCase) {}

  @Mutation(() => __EntityName__Obj)
  async create__EntityName__(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: Create__EntityName__Input,
  ): Promise<__EntityName__Obj> {
    return this.create__EntityName__UseCase.execute({
      ...input,
      ...user,
    });
  }
}
