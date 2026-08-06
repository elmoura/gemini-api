import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { TableObj } from './usecases/types/table.object';
import { CreateTableUseCase } from './usecases/create-table.usecase';
import { CreateTableInput } from './usecases/types/create-table.input';
import { ListLocationTablesUseCase } from './usecases/list-location-tables.usecase';
import { ListAvailableLocationTablesUseCase } from './usecases/list-available-location-tables.usecase';
import { UpdateTableUseCase } from './usecases/update-table.usecase';
import { UpdateTableInput } from './usecases/types/update-table.input';
import { DeleteTableUseCase } from './usecases/delete-table.usecase';
import { DeleteTableInput } from './usecases/types/delete-table.input';

@Resolver()
@UseGuards(AuthGuard)
export class TablesResolver {
  constructor(
    private readonly createTableUseCase: CreateTableUseCase,
    private readonly listLocationTablesUseCase: ListLocationTablesUseCase,
    private readonly listAvailableLocationTablesUseCase: ListAvailableLocationTablesUseCase,
    private readonly updateTableUseCase: UpdateTableUseCase,
    private readonly deleteTableUseCase: DeleteTableUseCase,
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

  @Query(() => [TableObj])
  async listAvailableLocationTables(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj[]> {
    return this.listAvailableLocationTablesUseCase.execute(currentUserData);
  }

  @Mutation(() => TableObj)
  async updateTable(
    @Args('input') input: UpdateTableInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj> {
    return this.updateTableUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Mutation(() => TableObj)
  async deleteTable(
    @Args('input') input: DeleteTableInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj> {
    return this.deleteTableUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }
}
