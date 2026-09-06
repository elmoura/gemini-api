import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { CashMovementObj } from './usecases/dto/cash-movement.object';
import { CashRegisterObj } from './usecases/dto/cash-register.object';
import { CloseCashRegisterInput } from './usecases/dto/close-cash-register.input';
import { ListCashMovementsInput } from './usecases/dto/list-cash-movements.input';
import { ListCashRegistersInput } from './usecases/dto/list-cash-registers.input';
import { ListCashRegistersOutput } from './usecases/dto/list-cash-registers.output';
import { OpenCashRegisterInput } from './usecases/dto/open-cash-register.input';
import { RegisterCashMovementInput } from './usecases/dto/register-cash-movement.input';
import { CloseCashRegisterUseCase } from './usecases/close-cash-register.usecase';
import { GetCurrentCashRegisterUseCase } from './usecases/get-current-cash-register.usecase';
import { ListCashMovementsUseCase } from './usecases/list-cash-movements.usecase';
import { ListCashRegistersUseCase } from './usecases/list-cash-registers.usecase';
import { OpenCashRegisterUseCase } from './usecases/open-cash-register.usecase';
import { RegisterCashMovementUseCase } from './usecases/register-cash-movement.usecase';

@Resolver()
@UseGuards(AuthGuard)
export class CashRegistersResolver {
  constructor(
    private openCashRegisterUseCase: OpenCashRegisterUseCase,
    private closeCashRegisterUseCase: CloseCashRegisterUseCase,
    private getCurrentCashRegisterUseCase: GetCurrentCashRegisterUseCase,
    private listCashRegistersUseCase: ListCashRegistersUseCase,
    private registerCashMovementUseCase: RegisterCashMovementUseCase,
    private listCashMovementsUseCase: ListCashMovementsUseCase,
  ) {}

  @Mutation(() => CashRegisterObj)
  openCashRegister(
    @Args('input') input: OpenCashRegisterInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<CashRegisterObj> {
    return this.openCashRegisterUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Mutation(() => CashRegisterObj)
  closeCashRegister(
    @Args('input') input: CloseCashRegisterInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<CashRegisterObj> {
    return this.closeCashRegisterUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => CashRegisterObj, { nullable: true })
  getCurrentCashRegister(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<CashRegisterObj | null> {
    return this.getCurrentCashRegisterUseCase.execute(currentUserData);
  }

  @Query(() => ListCashRegistersOutput)
  listCashRegisters(
    @Args('input') input: ListCashRegistersInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<ListCashRegistersOutput> {
    return this.listCashRegistersUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Mutation(() => CashMovementObj)
  registerCashMovement(
    @Args('input') input: RegisterCashMovementInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<CashMovementObj> {
    return this.registerCashMovementUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }

  @Query(() => [CashMovementObj])
  listCashMovements(
    @Args('input') input: ListCashMovementsInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<CashMovementObj[]> {
    return this.listCashMovementsUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }
}
