import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Directive } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { AddTableOrderItemUseCase } from './usecases/add-table-order-item.usecase';
import {
  AddOrderTabItemInput,
  AddTableOrderItemInput,
} from './usecases/types/add-order-tab-item.input';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { CreateTableOrderInput } from './usecases/types/create-table-order.input';
import { ListTableOrdersOutput } from './usecases/types/list-table-orders.output';
import { ListTableOrdersUseCase } from './usecases/list-table-orders.usecase';
import { ListTableOrdersInput } from './usecases/types/list-table-orders.input';
import {
  OrderTabObj,
  TableOrderObj,
} from './usecases/types/table-order.object';
import {
  RemoveOrderTabItemInput,
  RemoveTableOrderItemInput,
} from './usecases/types/remove-order-tab-item.input';
import { RemoveTableOrderItemUseCase } from './usecases/remove-table-order-item.usecase';
import {
  FinishOrderTabInput,
  FinishTableOrderInput,
} from './usecases/types/finish-order-tab.input';
import { FinishTableOrderUseCase } from './usecases/finish-table-order.usecase';
import { CreateOrderTabUseCase } from './usecases/create-order-tab.usecase';
import { CreateOrderTabInput } from './usecases/types/create-order-tab.input';
import { AddOrderTabItemUseCase } from './usecases/add-order-tab-item.usecase';
import { RemoveOrderTabItemUseCase } from './usecases/remove-order-tab-item.usecase';
import { FinishOrderTabUseCase } from './usecases/finish-order-tab.usecase';
import { AddOrderTabPaymentUseCase } from './usecases/add-order-tab-payment.usecase';
import { AddOrderTabPaymentInput } from './usecases/types/add-order-tab-payment.input';
import { FindTableOrderUseCase } from './usecases/find-table-order.usecase';
import { FindOrderTabUseCase } from './usecases/find-order-tab.usecase';
import { ListOrderTabsUseCase } from './usecases/list-order-tabs.usecase';
import {
  FindOrderTabInput,
  FindTableOrderInput,
  ListOrderTabsInput,
} from './usecases/types/find-order-tab.input';
import { UpdateOrderTabItemUseCase } from './usecases/update-order-tab-item.usecase';
import { UpdateOrderTabItemInput } from './usecases/types/update-order-tab-item.input';
import {
  ClientSource,
  ClientSourceData,
} from '@modules/print-jobs/decorators/client-source.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class TableOrdersResolver {
  constructor(
    private listTableOrdersUseCase: ListTableOrdersUseCase,
    private createTableOrderUseCase: CreateTableOrderUseCase,
    private createOrderTabUseCase: CreateOrderTabUseCase,
    private addOrderTabItemUseCase: AddOrderTabItemUseCase,
    private removeOrderTabItemUseCase: RemoveOrderTabItemUseCase,
    private finishOrderTabUseCase: FinishOrderTabUseCase,
    private addOrderTabPaymentUseCase: AddOrderTabPaymentUseCase,
    private finishTableOrderUseCase: FinishTableOrderUseCase,
    private findTableOrderUseCase: FindTableOrderUseCase,
    private findOrderTabUseCase: FindOrderTabUseCase,
    private listOrderTabsUseCase: ListOrderTabsUseCase,
    private addTableOrderItemUseCase: AddTableOrderItemUseCase,
    private removeTableOrderItemUseCase: RemoveTableOrderItemUseCase,
    private updateOrderTabItemUseCase: UpdateOrderTabItemUseCase,
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

  @Mutation(() => OrderTabObj)
  async createOrderTab(
    @Args('input') input: CreateOrderTabInput,
    @CurrentUser() currentUserData: CurrentUserData,
    @ClientSource() clientSource: ClientSourceData,
  ): Promise<OrderTabObj> {
    return this.createOrderTabUseCase.execute({
      ...input,
      ...currentUserData,
      source: clientSource,
    });
  }

  @Mutation(() => OrderTabObj)
  addOrderTabItem(
    @Args('input') input: AddOrderTabItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
    @ClientSource() clientSource: ClientSourceData,
  ): Promise<OrderTabObj> {
    return this.addOrderTabItemUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      locationId: currentUserData.locationId,
      source: clientSource,
    } as AddOrderTabItemInput & { locationId: string });
  }

  @Mutation(() => OrderTabObj)
  updateOrderTabItem(
    @Args('input') input: UpdateOrderTabItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
    @ClientSource() clientSource: ClientSourceData,
  ): Promise<OrderTabObj> {
    return this.updateOrderTabItemUseCase.execute({
      ...input,
      ...currentUserData,
      source: clientSource,
    });
  }

  @Mutation(() => OrderTabObj)
  async removeOrderTabItem(
    @Args('input') input: RemoveOrderTabItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
    @ClientSource() clientSource: ClientSourceData,
  ): Promise<OrderTabObj> {
    return this.removeOrderTabItemUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      source: clientSource,
    });
  }

  @Mutation(() => OrderTabObj)
  async finishOrderTab(
    @Args('input') input: FinishOrderTabInput,
    @CurrentUser() currentUserData: CurrentUserData,
    @ClientSource() clientSource: ClientSourceData,
  ): Promise<OrderTabObj> {
    return this.finishOrderTabUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      source: clientSource,
    });
  }

  @Mutation(() => OrderTabObj)
  addOrderTabPayment(
    @Args('input') input: AddOrderTabPaymentInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<OrderTabObj> {
    return this.addOrderTabPaymentUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      locationId: currentUserData.locationId,
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

  @Query(() => TableOrderObj)
  async findTableOrder(
    @Args('input') input: FindTableOrderInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.findTableOrderUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => OrderTabObj)
  async findOrderTab(
    @Args('input') input: FindOrderTabInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<OrderTabObj> {
    return this.findOrderTabUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => [OrderTabObj])
  async listOrderTabs(
    @Args('input') input: ListOrderTabsInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<OrderTabObj[]> {
    return this.listOrderTabsUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Directive('@deprecated(reason: "Use addOrderTabItem")')
  @Mutation(() => TableOrderObj)
  addTableOrderItem(
    @Args('input') input: AddTableOrderItemInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableOrderObj> {
    return this.addTableOrderItemUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    }) as never;
  }

  @Directive('@deprecated(reason: "Use removeOrderTabItem")')
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
}
