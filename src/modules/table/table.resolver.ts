import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { TableObj } from './usecases/types/table.object';
import { CreateTableUseCase } from './usecases/create-table.usecase';
import { CreateTableInput } from './usecases/types/create-table.input';

@Resolver()
@UseGuards(AuthGuard)
export class TableResolver {
  constructor(private readonly createTableUseCase: CreateTableUseCase) {}

  // criar fluxo de settar o locationId atraves do token
  @Mutation(() => TableObj)
  async createTable(
    @Args('input') input: CreateTableInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<TableObj> {
    return this.createTableUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      // precisa receber o locationId atraves do token
    });
  }
}
