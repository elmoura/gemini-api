import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashMovementDataSource } from '../datasources/cash-movement.datasource';
import { CashRegisterDataSource } from '../datasources/cash-register.datasource';
import { CashMovement } from '../entities/cash-movement';
import { CashRegisterNotOpenException } from '../errors/cash-register-not-open.exception';
import { roundToCents } from '../utils/cash-register-summary.utils';
import { RegisterCashMovementInput } from './dto/register-cash-movement.input';

/** Sangria (WITHDRAWAL) ou suprimento (SUPPLY) — movimentação manual de dinheiro. */
@Injectable()
export class RegisterCashMovementUseCase
  implements
    IBaseUseCase<RegisterCashMovementInput & CurrentUserData, CashMovement>
{
  constructor(
    private cashRegisterDataSource: CashRegisterDataSource,
    private cashMovementDataSource: CashMovementDataSource,
  ) {}

  async execute(
    input: RegisterCashMovementInput & CurrentUserData,
  ): Promise<CashMovement> {
    const { organizationId, locationId, userId, type, reason } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const cashRegister = await this.cashRegisterDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (!cashRegister) throw new CashRegisterNotOpenException();

    return this.cashMovementDataSource.createOne({
      cashRegisterId: cashRegister._id,
      organizationId,
      locationId,
      type,
      amount: roundToCents(input.amount),
      reason,
      registeredByUserId: userId,
    });
  }
}
