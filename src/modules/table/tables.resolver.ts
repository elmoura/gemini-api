import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { TableObj } from './usecases/types/table.object';
import { CreateTableUseCase } from './usecases/create-table.usecase';
import { CreateTableInput } from './usecases/types/create-table.input';
import { ListLocationTablesUseCase } from './usecases/list-location-tables.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class TablesResolver {
  constructor(
    private readonly createTableUseCase: CreateTableUseCase,
    private readonly listLocationTablesUseCase: ListLocationTablesUseCase,
  ) {}

  @Mutation(() => TableObj)
  async createTable(
    @Args('input') input: CreateTableInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj> {
    return this.createTableUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => [TableObj])
  async listLocationTables(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj[]> {
    return this.listLocationTablesUseCase.execute(currentUserData);
  }
}
