import { UnauthorizedException } from '@nestjs/common';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { CashMovementType } from '../entities/cash-movement';
import { CashRegisterStatus } from '../entities/cash-register';
import { CashRegisterNotFoundException } from '../errors/cash-register-not-found.exception';
import { CashRegisterNotOpenException } from '../errors/cash-register-not-open.exception';
import { CloseCashRegisterUseCase } from './close-cash-register.usecase';

describe('CloseCashRegisterUseCase', () => {
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
    findById: jest.fn(),
    closeOne: jest.fn(),
  };
  const cashMovementDataSource = {
    sumByCashRegisterAndType: jest.fn(),
  };
  const cashRegisterPaymentSummaryDataSource = {
    summarizeByCashRegister: jest.fn(),
  };

  const useCase = new CloseCashRegisterUseCase(
    cashRegisterDataSource as never,
    cashMovementDataSource as never,
    cashRegisterPaymentSummaryDataSource as never,
  );

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  const openCashRegister = {
    _id: 'cash-register-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    status: CashRegisterStatus.OPEN,
    openedByUserId: 'user-id',
    openingAmount: 100,
    startedAt: new Date('2026-08-31T10:00:00.000Z'),
    finishedAt: null,
    createdAt: new Date('2026-08-31T10:00:00.000Z'),
    updatedAt: new Date('2026-08-31T10:00:00.000Z'),
  };

  const cashOnlySummary = {
    totalCashPayments: 200,
    totalNonCashPayments: 0,
    totalCashReceived: 200,
    totalChangeGiven: 0,
    byMethod: [{ method: PaymentMethods.CASH, total: 200, count: 2 }],
    paymentsCount: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(
      openCashRegister,
    );
    cashRegisterDataSource.closeOne.mockResolvedValue(true);
    cashRegisterDataSource.findById.mockImplementation(async () => ({
      ...openCashRegister,
      status: CashRegisterStatus.CLOSED,
      finishedAt: new Date('2026-08-31T22:00:00.000Z'),
      closingSummary: cashOnlySummary,
    }));
    cashMovementDataSource.sumByCashRegisterAndType.mockImplementation(
      async (_id, _org, _loc, type) =>
        type === CashMovementType.SUPPLY ? 50 : 30,
    );
    cashRegisterPaymentSummaryDataSource.summarizeByCashRegister.mockResolvedValue(
      cashOnlySummary,
    );
  });

  it('fecha o caixa calculando esperado = fundo + suprimentos - sangrias + dinheiro', async () => {
    const result = await useCase.execute({
      ...currentUser,
      closingAmount: 320,
    });

    expect(cashRegisterDataSource.closeOne).toHaveBeenCalledWith(
      'cash-register-id',
      'org-id',
      expect.objectContaining({
        closedByUserId: 'user-id',
        closingAmount: 320,
        // 100 + 50 - 30 + 200
        expectedClosingAmount: 320,
        difference: 0,
        closingSummary: cashOnlySummary,
      }),
    );
    expect(result.status).toBe(CashRegisterStatus.CLOSED);
    expect(result.summary).toEqual(cashOnlySummary);
  });

  it('NÃO soma PIX nem cartão no valor esperado em gaveta (ADR-4)', async () => {
    cashRegisterPaymentSummaryDataSource.summarizeByCashRegister.mockResolvedValue(
      {
        totalCashPayments: 200,
        totalNonCashPayments: 1000,
        byMethod: [
          { method: PaymentMethods.CASH, total: 200, count: 2 },
          { method: PaymentMethods.PIX, total: 400, count: 1 },
          { method: PaymentMethods.CREDIT_CARD, total: 350, count: 3 },
          { method: PaymentMethods.DEBIT_CARD, total: 250, count: 2 },
        ],
        paymentsCount: 8,
      },
    );

    await useCase.execute({ ...currentUser, closingAmount: 320 });

    const [, , closeData] = cashRegisterDataSource.closeOne.mock.calls[0];

    // Mesmo valor do cenário só-dinheiro: PIX e cartão não movem a agulha.
    expect(closeData.expectedClosingAmount).toBe(320);
    expect(closeData.difference).toBe(0);
  });

  it('registra divergência e NÃO bloqueia o fechamento', async () => {
    cashRegisterDataSource.findById.mockResolvedValue({
      ...openCashRegister,
      status: CashRegisterStatus.CLOSED,
      difference: -20,
      closingSummary: cashOnlySummary,
    });

    const result = await useCase.execute({
      ...currentUser,
      closingAmount: 300,
    });

    expect(cashRegisterDataSource.closeOne).toHaveBeenCalledWith(
      'cash-register-id',
      'org-id',
      expect.objectContaining({ difference: -20 }),
    );
    expect(result.status).toBe(CashRegisterStatus.CLOSED);
  });

  it('trata ruído de ponto flutuante com tolerância, não com igualdade exata', async () => {
    cashRegisterPaymentSummaryDataSource.summarizeByCashRegister.mockResolvedValue(
      { ...cashOnlySummary, totalCashPayments: 200.1 },
    );

    await useCase.execute({ ...currentUser, closingAmount: 320.1 });

    const [, , closeData] = cashRegisterDataSource.closeOne.mock.calls[0];

    expect(closeData.difference).toBe(0);
  });

  it('apura o resumo isolando por organização e unidade (multi-tenant)', async () => {
    await useCase.execute({ ...currentUser, closingAmount: 320 });

    expect(
      cashRegisterPaymentSummaryDataSource.summarizeByCashRegister,
    ).toHaveBeenCalledWith('org-id', 'location-id', 'cash-register-id');
    expect(
      cashMovementDataSource.sumByCashRegisterAndType,
    ).toHaveBeenCalledWith(
      'cash-register-id',
      'org-id',
      'location-id',
      CashMovementType.SUPPLY,
    );
  });

  it('rejeita quando não há caixa aberto na unidade', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(
      useCase.execute({ ...currentUser, closingAmount: 320 }),
    ).rejects.toBeInstanceOf(CashRegisterNotOpenException);

    expect(cashRegisterDataSource.closeOne).not.toHaveBeenCalled();
  });

  it('rejeita quando o caixa some depois do fechamento', async () => {
    cashRegisterDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ ...currentUser, closingAmount: 320 }),
    ).rejects.toBeInstanceOf(CashRegisterNotFoundException);
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({
        ...currentUser,
        locationId: undefined,
        closingAmount: 320,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(cashRegisterDataSource.closeOne).not.toHaveBeenCalled();
  });
});
