import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { AddTableOrderItemUseCase } from './usecases/add-table-order-item.usecase';
import { AddTableOrderItemInput } from './usecases/types/add-table-order.input';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { CreateTableOrderInput } from './usecases/types/create-table-order.input';
import { ListTableOrdersOutput } from './usecases/types/list-table-orders.output';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { ListTableOrdersInput } from './usecases/types/list-table-orders.input';
import { TableOrderObj } from './usecases/types/table-order.object';

@Resolver()
@UseGuards(AuthGuard)
export class TableOrdersResolver {
  constructor(
    private addTableOrderItemUseCase: AddTableOrderItemUseCase,
    private listTableOrdersUseCase: ListTableOrdersUseCase,
    private createTableOrderUseCase: CreateTableOrderUseCase,
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
  addTableOrderItem(
    @Args('input') input: AddTableOrderItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.addTableOrderItemUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }
}
