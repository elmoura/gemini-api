import { CashMovementType } from '../../entities/cash-movement';
import {
  CashRegister,
  CashRegisterPaymentSummary,
} from '../../entities/cash-register';
import { CashMovementDataSource } from '../../datasources/cash-movement.datasource';
import { CashRegisterPaymentSummaryDataSource } from '../../datasources/cash-register-payment-summary.datasource';
import { calculateExpectedClosingAmount } from '../../utils/cash-register-summary.utils';

export type OpenCashRegisterTotals = {
  summary: CashRegisterPaymentSummary;
  supplies: number;
  withdrawals: number;
  expectedClosingAmount: number;
};

/**
 * Apura, ao vivo, os totais de um caixa aberto: suprimentos, sangrias e o
 * resumo por método. `expectedClosingAmount` sai da fórmula canônica do ADR-4
 * — só dinheiro, nunca PIX/cartão.
 */
export async function summarizeOpenCashRegister(
  cashRegister: CashRegister,
  cashMovementDataSource: CashMovementDataSource,
  cashRegisterPaymentSummaryDataSource: CashRegisterPaymentSummaryDataSource,
): Promise<OpenCashRegisterTotals> {
  const { _id, organizationId, locationId, openingAmount } = cashRegister;

  const [supplies, withdrawals, summary] = await Promise.all([
    cashMovementDataSource.sumByCashRegisterAndType(
      _id,
      organizationId,
      locationId,
      CashMovementType.SUPPLY,
    ),
    cashMovementDataSource.sumByCashRegisterAndType(
      _id,
      organizationId,
      locationId,
      CashMovementType.WITHDRAWAL,
    ),
    cashRegisterPaymentSummaryDataSource.summarizeByCashRegister(
      organizationId,
      locationId,
      _id,
    ),
  ]);

  return {
    summary,
    supplies,
    withdrawals,
    expectedClosingAmount: calculateExpectedClosingAmount({
      openingAmount,
      supplies,
      withdrawals,
      totalCashPayments: summary.totalCashPayments,
    }),
  };
}
