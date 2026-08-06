import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { ComplementGroupObj } from './usecases/types/complement-group.object';
import { ComplementObj } from './usecases/types/complement.object';
import { CreateComplementGroupInput } from './usecases/types/create-complement-group.input';
import { UpdateComplementGroupInput } from './usecases/types/update-complement-group.input';
import { FindComplementGroupInput } from './usecases/types/find-complement-group.input';
import { CreateComplementInput } from './usecases/types/create-complement.input';
import { UpdateComplementInput } from './usecases/types/update-complement.input';
import {
  FindComplementInput,
  ListComplementsInput,
} from './usecases/types/complement.inputs';
import { CreateComplementGroupUseCase } from './usecases/create-complement-group.usecase';
import { UpdateComplementGroupUseCase } from './usecases/update-complement-group.usecase';
import {
  FindComplementGroupUseCase,
  ListComplementGroupsUseCase,
} from './usecases/list-find-complement-group.usecase';
import { CreateComplementUseCase } from './usecases/create-complement.usecase';
import { UpdateComplementUseCase } from './usecases/update-complement.usecase';
import {
  FindComplementUseCase,
  ListComplementsUseCase,
} from './usecases/list-find-complement.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class ComplementGroupsResolver {
  constructor(
    private readonly createComplementGroupUseCase: CreateComplementGroupUseCase,
    private readonly updateComplementGroupUseCase: UpdateComplementGroupUseCase,
    private readonly listComplementGroupsUseCase: ListComplementGroupsUseCase,
    private readonly findComplementGroupUseCase: FindComplementGroupUseCase,
    private readonly createComplementUseCase: CreateComplementUseCase,
    private readonly updateComplementUseCase: UpdateComplementUseCase,
    private readonly listComplementsUseCase: ListComplementsUseCase,
    private readonly findComplementUseCase: FindComplementUseCase,
  ) {}

  @Mutation(() => ComplementGroupObj)
  createComplementGroup(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateComplementGroupInput,
  ): Promise<ComplementGroupObj> {
    return this.createComplementGroupUseCase.execute({ ...input, ...user });
  }

  @Mutation(() => ComplementGroupObj)
  updateComplementGroup(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateComplementGroupInput,
  ): Promise<ComplementGroupObj> {
    return this.updateComplementGroupUseCase.execute({ ...input, ...user });
  }

  @Query(() => [ComplementGroupObj])
  listComplementGroups(
    @CurrentUser() user: CurrentUserData,
  ): Promise<ComplementGroupObj[]> {
    return this.listComplementGroupsUseCase.execute(user);
  }

  @Query(() => ComplementGroupObj)
  findComplementGroup(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: FindComplementGroupInput,
  ): Promise<ComplementGroupObj> {
    return this.findComplementGroupUseCase.execute({ ...input, ...user });
  }

  @Mutation(() => ComplementObj)
  createComplement(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: CreateComplementInput,
  ): Promise<ComplementObj> {
    return this.createComplementUseCase.execute({ ...input, ...user });
  }

  @Mutation(() => ComplementObj)
  updateComplement(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: UpdateComplementInput,
  ): Promise<ComplementObj> {
    return this.updateComplementUseCase.execute({ ...input, ...user });
  }

  @Query(() => [ComplementObj])
  listComplements(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: ListComplementsInput,
  ): Promise<ComplementObj[]> {
    return this.listComplementsUseCase.execute({ ...input, ...user });
  }

  @Query(() => ComplementObj)
  findComplement(
    @CurrentUser() user: CurrentUserData,
    @Args('input') input: FindComplementInput,
  ): Promise<ComplementObj> {
    return this.findComplementUseCase.execute({ ...input, ...user });
  }
}
