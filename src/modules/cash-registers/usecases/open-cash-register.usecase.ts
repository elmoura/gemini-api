import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashRegisterDataSource } from '../datasources/cash-register.datasource';
import { CashRegisterStatus } from '../entities/cash-register';
import { CashRegisterAlreadyOpenException } from '../errors/cash-register-already-open.exception';
import { CashRegisterObj } from './dto/cash-register.object';
import { OpenCashRegisterInput } from './dto/open-cash-register.input';
import { buildCashRegisterView } from './helpers/build-cash-register-view';
import {
  buildEmptyCashRegisterSummary,
  calculateExpectedClosingAmount,
  roundToCents,
} from '../utils/cash-register-summary.utils';

/**
 * Abre a sessão de caixa da unidade. NÃO exige turno aberto — ADR-1b, o
 * operador pode precisar contar o fundo antes de abrir o turno.
 */
@Injectable()
export class OpenCashRegisterUseCase
  implements
    IBaseUseCase<OpenCashRegisterInput & CurrentUserData, CashRegisterObj>
{
  constructor(private cashRegisterDataSource: CashRegisterDataSource) {}

  async execute(
    input: OpenCashRegisterInput & CurrentUserData,
  ): Promise<CashRegisterObj> {
    const { organizationId, locationId, userId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const existing = await this.cashRegisterDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (existing) throw new CashRegisterAlreadyOpenException();

    const openingAmount = roundToCents(input.openingAmount);

    const cashRegister = await this.cashRegisterDataSource.createOne({
      organizationId,
      locationId,
      status: CashRegisterStatus.OPEN,
      openedByUserId: userId,
      openingAmount,
      startedAt: new Date(),
      finishedAt: null,
    });

    return buildCashRegisterView({
      cashRegister,
      summary: buildEmptyCashRegisterSummary(),
      expectedClosingAmount: calculateExpectedClosingAmount({
        openingAmount,
        supplies: 0,
        withdrawals: 0,
        totalCashPayments: 0,
      }),
    });
  }
}
