import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateTableOrderUseCase } from './usecases/create-table-order.usecase';
import { TableOrderObj } from './usecases/types/table-order.object';
import { CreateTableOrderInput } from './usecases/types/create-table-order.input';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';

@Resolver()
export class TableOrderResolver {
  constructor(private createTableOrderUseCase: CreateTableOrderUseCase) {}

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
}
