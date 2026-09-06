import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashMovementDataSource } from '../datasources/cash-movement.datasource';
import { CashMovement } from '../entities/cash-movement';
import { ListCashMovementsInput } from './dto/list-cash-movements.input';

@Injectable()
export class ListCashMovementsUseCase
  implements
    IBaseUseCase<ListCashMovementsInput & CurrentUserData, CashMovement[]>
{
  constructor(private cashMovementDataSource: CashMovementDataSource) {}

  async execute(
    input: ListCashMovementsInput & CurrentUserData,
  ): Promise<CashMovement[]> {
    const { organizationId, locationId, cashRegisterId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    // Filtra SEMPRE por organização + unidade do JWT: um cashRegisterId
    // vazado não pode expor movimentação de outro tenant.
    return this.cashMovementDataSource.listByCashRegister(
      cashRegisterId,
      organizationId,
      locationId,
    );
  }
}
