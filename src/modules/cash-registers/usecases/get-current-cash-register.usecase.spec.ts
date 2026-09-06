import { UnauthorizedException } from '@nestjs/common';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { CashMovementType } from '../entities/cash-movement';
import { CashRegisterStatus } from '../entities/cash-register';
import { GetCurrentCashRegisterUseCase } from './get-current-cash-register.usecase';

describe('GetCurrentCashRegisterUseCase', () => {
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
  };
  const cashMovementDataSource = {
    sumByCashRegisterAndType: jest.fn(),
  };
  const cashRegisterPaymentSummaryDataSource = {
    summarizeByCashRegister: jest.fn(),
  };

  const useCase = new GetCurrentCashRegisterUseCase(
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

  const summary = {
    totalCashPayments: 200,
    totalNonCashPayments: 1000,
    byMethod: [
      { method: PaymentMethods.CASH, total: 200, count: 2 },
      { method: PaymentMethods.PIX, total: 400, count: 1 },
      { method: PaymentMethods.CREDIT_CARD, total: 350, count: 3 },
      { method: PaymentMethods.DEBIT_CARD, total: 250, count: 2 },
    ],
    paymentsCount: 8,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(
      openCashRegister,
    );
    cashMovementDataSource.sumByCashRegisterAndType.mockImplementation(
      async (_id, _org, _loc, type) =>
        type === CashMovementType.SUPPLY ? 50 : 30,
    );
    cashRegisterPaymentSummaryDataSource.summarizeByCashRegister.mockResolvedValue(
      summary,
    );
  });

  it('retorna o caixa aberto com resumo ao vivo e esperado projetado', async () => {
    const result = await useCase.execute(currentUser);

    expect(result.status).toBe(CashRegisterStatus.OPEN);
    expect(result.summary).toEqual(summary);
    // 100 + 50 - 30 + 200 (dinheiro) — PIX e cartão ficam de fora.
    expect(result.expectedClosingAmount).toBe(320);
  });

  it('retorna null quando não há caixa aberto na unidade', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(useCase.execute(currentUser)).resolves.toBeNull();

    expect(
      cashRegisterPaymentSummaryDataSource.summarizeByCashRegister,
    ).not.toHaveBeenCalled();
  });

  it('apura o resumo isolando por organização e unidade (multi-tenant)', async () => {
    await useCase.execute(currentUser);

    expect(
      cashRegisterPaymentSummaryDataSource.summarizeByCashRegister,
    ).toHaveBeenCalledWith('org-id', 'location-id', 'cash-register-id');
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({ ...currentUser, locationId: undefined }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(cashRegisterDataSource.findOpenByLocation).not.toHaveBeenCalled();
  });
});
