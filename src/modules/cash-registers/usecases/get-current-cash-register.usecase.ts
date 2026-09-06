import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashMovementDataSource } from '../datasources/cash-movement.datasource';
import { CashRegisterPaymentSummaryDataSource } from '../datasources/cash-register-payment-summary.datasource';
import { CashRegisterDataSource } from '../datasources/cash-register.datasource';
import { CashRegisterObj } from './dto/cash-register.object';
import { buildCashRegisterView } from './helpers/build-cash-register-view';
import { summarizeOpenCashRegister } from './helpers/summarize-open-cash-register';

/**
 * Retorna o caixa aberto da unidade com o resumo calculado ao vivo e o
 * `expectedClosingAmount` projetado, para a tela mostrar o esperado em gaveta
 * em tempo real.
 */
@Injectable()
export class GetCurrentCashRegisterUseCase
  implements IBaseUseCase<CurrentUserData, CashRegisterObj | null>
{
  constructor(
    private cashRegisterDataSource: CashRegisterDataSource,
    private cashMovementDataSource: CashMovementDataSource,
    private cashRegisterPaymentSummaryDataSource: CashRegisterPaymentSummaryDataSource,
  ) {}

  async execute(input: CurrentUserData): Promise<CashRegisterObj | null> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const cashRegister = await this.cashRegisterDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (!cashRegister) return null;

    const { summary, expectedClosingAmount } = await summarizeOpenCashRegister(
      cashRegister,
      this.cashMovementDataSource,
      this.cashRegisterPaymentSummaryDataSource,
    );

    return buildCashRegisterView({
      cashRegister,
      summary,
      expectedClosingAmount,
    });
  }
}
