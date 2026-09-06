import { UnauthorizedException } from '@nestjs/common';
import { PaymentMethods } from '@shared/enums/payment-methods';
import { CashRegisterStatus } from '../entities/cash-register';
import { ListCashRegistersUseCase } from './list-cash-registers.usecase';

describe('ListCashRegistersUseCase', () => {
  const cashRegisterDataSource = {
    listByLocationAndFilters: jest.fn(),
  };

  const useCase = new ListCashRegistersUseCase(cashRegisterDataSource as never);

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  const closingSummary = {
    totalCashPayments: 200,
    totalNonCashPayments: 400,
    byMethod: [
      { method: PaymentMethods.CASH, total: 200, count: 2 },
      { method: PaymentMethods.PIX, total: 400, count: 1 },
    ],
    paymentsCount: 3,
  };

  const closedCashRegister = {
    _id: 'cash-register-id',
    organizationId: 'org-id',
    locationId: 'location-id',
    status: CashRegisterStatus.CLOSED,
    openedByUserId: 'user-id',
    closedByUserId: 'user-id',
    openingAmount: 100,
    closingAmount: 300,
    expectedClosingAmount: 300,
    difference: 0,
    closingSummary,
    startedAt: new Date('2026-08-31T10:00:00.000Z'),
    finishedAt: new Date('2026-08-31T22:00:00.000Z'),
    createdAt: new Date('2026-08-31T10:00:00.000Z'),
    updatedAt: new Date('2026-08-31T22:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashRegisterDataSource.listByLocationAndFilters.mockResolvedValue({
      cashRegisters: [closedCashRegister],
      totalCount: 1,
    });
  });

  it('devolve o closingSummary persistido, sem agregação por item', async () => {
    const result = await useCase.execute(currentUser);

    expect(result.cashRegistersCount).toBe(1);
    expect(result.cashRegisters[0].summary).toEqual(closingSummary);
    expect(result.cashRegisters[0].expectedClosingAmount).toBe(300);
  });

  it('aplica paginação padrão e repassa filtros de período', async () => {
    const startedAtFrom = new Date('2026-08-01T00:00:00.000Z');

    const result = await useCase.execute({ ...currentUser, startedAtFrom });

    expect(
      cashRegisterDataSource.listByLocationAndFilters,
    ).toHaveBeenCalledWith(
      'org-id',
      'location-id',
      expect.objectContaining({ limit: 20, offset: 0, startedAtFrom }),
    );
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
  });

  it('devolve resumo zerado quando o caixa não tem snapshot persistido', async () => {
    cashRegisterDataSource.listByLocationAndFilters.mockResolvedValue({
      cashRegisters: [{ ...closedCashRegister, closingSummary: undefined }],
      totalCount: 1,
    });

    const result = await useCase.execute(currentUser);

    expect(result.cashRegisters[0].summary).toEqual({
      totalCashPayments: 0,
      totalNonCashPayments: 0,
      byMethod: [],
      paymentsCount: 0,
    });
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({ ...currentUser, locationId: undefined }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(
      cashRegisterDataSource.listByLocationAndFilters,
    ).not.toHaveBeenCalled();
  });
});
