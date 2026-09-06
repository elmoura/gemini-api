import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashMovementDataSource } from '../datasources/cash-movement.datasource';
import { CashRegisterPaymentSummaryDataSource } from '../datasources/cash-register-payment-summary.datasource';
import { CashRegisterDataSource } from '../datasources/cash-register.datasource';
import { CashRegisterNotFoundException } from '../errors/cash-register-not-found.exception';
import { CashRegisterNotOpenException } from '../errors/cash-register-not-open.exception';
import {
  buildEmptyCashRegisterSummary,
  normalizeCashDifference,
  roundToCents,
} from '../utils/cash-register-summary.utils';
import { CloseCashRegisterInput } from './dto/close-cash-register.input';
import { CashRegisterObj } from './dto/cash-register.object';
import { buildCashRegisterView } from './helpers/build-cash-register-view';
import { summarizeOpenCashRegister } from './helpers/summarize-open-cash-register';

/**
 * Fecha a sessão de caixa com conferência. NÃO bloqueia por divergência: a
 * `difference` é registrada e devolvida — alertar é papel do front.
 */
@Injectable()
export class CloseCashRegisterUseCase
  implements
    IBaseUseCase<CloseCashRegisterInput & CurrentUserData, CashRegisterObj>
{
  constructor(
    private cashRegisterDataSource: CashRegisterDataSource,
    private cashMovementDataSource: CashMovementDataSource,
    private cashRegisterPaymentSummaryDataSource: CashRegisterPaymentSummaryDataSource,
  ) {}

  async execute(
    input: CloseCashRegisterInput & CurrentUserData,
  ): Promise<CashRegisterObj> {
    const { organizationId, locationId, userId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const openCashRegister =
      await this.cashRegisterDataSource.findOpenByLocation(
        organizationId,
        locationId,
      );

    if (!openCashRegister) throw new CashRegisterNotOpenException();

    const { summary, expectedClosingAmount } = await summarizeOpenCashRegister(
      openCashRegister,
      this.cashMovementDataSource,
      this.cashRegisterPaymentSummaryDataSource,
    );

    const closingAmount = roundToCents(input.closingAmount);

    await this.cashRegisterDataSource.closeOne(
      openCashRegister._id,
      organizationId,
      {
        finishedAt: new Date(),
        closedByUserId: userId,
        closingAmount,
        expectedClosingAmount,
        difference: normalizeCashDifference(
          closingAmount - expectedClosingAmount,
        ),
        closingSummary: summary,
      },
    );

    const closedCashRegister = await this.cashRegisterDataSource.findById(
      openCashRegister._id,
      organizationId,
    );

    if (!closedCashRegister) throw new CashRegisterNotFoundException();

    return buildCashRegisterView({
      cashRegister: closedCashRegister,
      summary:
        closedCashRegister.closingSummary ?? buildEmptyCashRegisterSummary(),
    });
  }
}
