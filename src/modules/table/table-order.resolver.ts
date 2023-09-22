import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { TableOrderObj } from './usecases/types/table-order.object';
import { CreateTableOrderInput } from './usecases/types/create-table-order.input';
import { ListTableOrdersOutput } from './usecases/types/list-table-orders.output';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { ListTableOrdersInput } from './usecases/types/list-table-orders.input';
import { AddTableOrderItemsInput } from './usecases/types/add-table-order-items.input';
import { AddTableOrderItemsUseCase } from './usecases/add-table-order-items.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class TableOrderResolver {
  constructor(
    private listTableOrdersUseCase: ListTableOrdersUseCase,
    private createTableOrderUseCase: CreateTableOrderUseCase,
    private addTableOrderItemsUseCase: AddTableOrderItemsUseCase,
  ) {}

  @Mutation(() => TableOrderObj)
  async createTableOrder(
    @Args('input') input: CreateTableOrderInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.createTableOrderUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => ListTableOrdersOutput)
  async listTableOrders(
    @Args('input') input: ListTableOrdersInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<ListTableOrdersOutput> {
    return this.listTableOrdersUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Mutation(() => TableOrderObj)
  async addTableOrderItems(
    @Args('input') input: AddTableOrderItemsInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.addTableOrderItemsUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }
}
