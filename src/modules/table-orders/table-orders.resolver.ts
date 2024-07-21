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
import { RemoveTableOrderItemInput } from './usecases/types/remove-table-order-item.input';
import { RemoveTableOrderItemUseCase } from './usecases/remove-table-order-item.usecase';
import { FinishTableOrderInput } from './usecases/types/finish-table-order.input';
import { FinishTableOrderUseCase } from './usecases/finish-table-order.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class TableOrdersResolver {
  constructor(
    private listTableOrdersUseCase: ListTableOrdersUseCase,
    private createTableOrderUseCase: CreateTableOrderUseCase,
    private addTableOrderItemUseCase: AddTableOrderItemUseCase,
    private removeTableOrderItemUseCase: RemoveTableOrderItemUseCase,
    private finishTableOrderUseCase: FinishTableOrderUseCase,
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

  @Mutation(() => TableOrderObj)
  async removeTableOrderItem(
    @Args('input') input: RemoveTableOrderItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.removeTableOrderItemUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @Mutation(() => TableOrderObj)
  async finishTableOrder(
    @Args('input') input: FinishTableOrderInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.finishTableOrderUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }
}
