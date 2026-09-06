import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CashRegisterDataSource } from '../datasources/cash-register.datasource';
import { buildEmptyCashRegisterSummary } from '../utils/cash-register-summary.utils';
import { ListCashRegistersInput } from './dto/list-cash-registers.input';
import { ListCashRegistersOutput } from './dto/list-cash-registers.output';
import { buildCashRegisterView } from './helpers/build-cash-register-view';

/**
 * Histórico paginado. Devolve o `closingSummary` já persistido — ZERO
 * agregação por item, sem N+1 (ADR-3).
 */
@Injectable()
export class ListCashRegistersUseCase
  implements
    IBaseUseCase<
      ListCashRegistersInput & CurrentUserData,
      ListCashRegistersOutput
    >
{
  constructor(private cashRegisterDataSource: CashRegisterDataSource) {}

  async execute(
    input: ListCashRegistersInput & CurrentUserData,
  ): Promise<ListCashRegistersOutput> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const {
      limit = 20,
      offset = 0,
      startedAtFrom,
      startedAtTo,
      finishedAtFrom,
      finishedAtTo,
    } = input;

    const { cashRegisters, totalCount } =
      await this.cashRegisterDataSource.listByLocationAndFilters(
        organizationId,
        locationId,
        {
          limit,
          offset,
          startedAtFrom,
          startedAtTo,
          finishedAtFrom,
          finishedAtTo,
        },
      );

    return {
      limit,
      offset,
      cashRegistersCount: totalCount,
      cashRegisters: cashRegisters.map((cashRegister) =>
        buildCashRegisterView({
          cashRegister,
          summary:
            cashRegister.closingSummary ?? buildEmptyCashRegisterSummary(),
        }),
      ),
    };
  }
}
