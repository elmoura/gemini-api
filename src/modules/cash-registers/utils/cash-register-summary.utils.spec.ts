import {
  buildEmptyCashRegisterSummary,
  calculateExpectedClosingAmount,
  normalizeCashDifference,
  roundToCents,
} from './cash-register-summary.utils';

describe('roundToCents', () => {
  it('arredonda para 2 casas decimais', () => {
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(0.1 + 0.2)).toBe(0.3);
  });
});

describe('buildEmptyCashRegisterSummary', () => {
  it('retorna resumo zerado sem métodos', () => {
    expect(buildEmptyCashRegisterSummary()).toEqual({
      totalCashPayments: 0,
      totalNonCashPayments: 0,
      byMethod: [],
      paymentsCount: 0,
    });
  });
});

describe('calculateExpectedClosingAmount', () => {
  it('soma fundo, suprimentos e dinheiro e subtrai sangrias', () => {
    expect(
      calculateExpectedClosingAmount({
        openingAmount: 100,
        supplies: 50,
        withdrawals: 30,
        totalCashPayments: 200,
      }),
    ).toBe(320);
  });

  it('arredonda o resultado a 2 casas', () => {
    expect(
      calculateExpectedClosingAmount({
        openingAmount: 0.1,
        supplies: 0.2,
        withdrawals: 0,
        totalCashPayments: 0,
      }),
    ).toBe(0.3);
  });
});

describe('normalizeCashDifference', () => {
  it('zera ruído de ponto flutuante dentro da tolerância', () => {
    expect(normalizeCashDifference(0.0000001)).toBe(0);
    expect(normalizeCashDifference(-0.0000001)).toBe(0);
  });

  it('mantém sobra e falta reais arredondadas a 2 casas', () => {
    expect(normalizeCashDifference(10.126)).toBe(10.13);
    expect(normalizeCashDifference(-5.5)).toBe(-5.5);
  });
});
