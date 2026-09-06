import { CashRegisterPaymentSummary } from '../entities/cash-register';

/**
 * Tolerância de comparação monetária: meio centavo. O projeto usa `number`
 * float para dinheiro (`pricing.total`), então sobra/falta NUNCA pode ser
 * comparada com `===` — ver ADR-4 / riscos da story-mãe.
 */
export const CASH_DIFFERENCE_TOLERANCE = 0.005;

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildEmptyCashRegisterSummary(): CashRegisterPaymentSummary {
  return {
    totalCashPayments: 0,
    totalNonCashPayments: 0,
    byMethod: [],
    paymentsCount: 0,
  };
}

type ExpectedClosingAmountParams = {
  openingAmount: number;
  supplies: number;
  withdrawals: number;
  totalCashPayments: number;
};

/**
 * Fórmula canônica de conferência (ADR-4). SÓ dinheiro entra aqui:
 * `totalNonCashPayments` e `byMethod` não aparecem em lugar nenhum.
 */
export function calculateExpectedClosingAmount({
  openingAmount,
  supplies,
  withdrawals,
  totalCashPayments,
}: ExpectedClosingAmountParams): number {
  return roundToCents(
    openingAmount + supplies - withdrawals + totalCashPayments,
  );
}

/**
 * Normaliza a sobra/falta: ruído de ponto flutuante abaixo da tolerância vira
 * zero, em vez de virar uma divergência fantasma na tela do operador.
 */
export function normalizeCashDifference(difference: number): number {
  if (Math.abs(difference) < CASH_DIFFERENCE_TOLERANCE) return 0;

  return roundToCents(difference);
}
