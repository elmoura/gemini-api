import {
  CashRegister,
  CashRegisterPaymentSummary,
} from '../../entities/cash-register';
import { CashRegisterObj } from '../dto/cash-register.object';

type BuildCashRegisterViewParams = {
  cashRegister: CashRegister;
  summary: CashRegisterPaymentSummary;
  /** Projeção ao vivo para caixa aberto; ausente usa o valor persistido. */
  expectedClosingAmount?: number;
};

/**
 * Monta o `CashRegisterObj` exposto no GraphQL. `summary` é sempre entregue
 * pronto pelo caller — ao vivo quando OPEN, `closingSummary` quando CLOSED —
 * para o front consumir um campo só (ADR-3).
 */
export function buildCashRegisterView({
  cashRegister,
  summary,
  expectedClosingAmount,
}: BuildCashRegisterViewParams): CashRegisterObj {
  return {
    _id: cashRegister._id,
    organizationId: cashRegister.organizationId,
    locationId: cashRegister.locationId,
    status: cashRegister.status,
    openedByUserId: cashRegister.openedByUserId,
    openingAmount: cashRegister.openingAmount,
    closedByUserId: cashRegister.closedByUserId,
    closingAmount: cashRegister.closingAmount,
    expectedClosingAmount:
      expectedClosingAmount ?? cashRegister.expectedClosingAmount,
    difference: cashRegister.difference,
    summary,
    startedAt: cashRegister.startedAt,
    finishedAt: cashRegister.finishedAt,
    createdAt: cashRegister.createdAt,
    updatedAt: cashRegister.updatedAt,
  };
}
