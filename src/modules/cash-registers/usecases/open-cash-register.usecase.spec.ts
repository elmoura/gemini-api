import { UnauthorizedException } from '@nestjs/common';
import { CashRegisterStatus } from '../entities/cash-register';
import { CashRegisterAlreadyOpenException } from '../errors/cash-register-already-open.exception';
import { OpenCashRegisterUseCase } from './open-cash-register.usecase';

describe('OpenCashRegisterUseCase', () => {
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
    createOne: jest.fn(),
  };

  const useCase = new OpenCashRegisterUseCase(cashRegisterDataSource as never);

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);
    cashRegisterDataSource.createOne.mockImplementation(async (input) => ({
      _id: 'cash-register-id',
      createdAt: new Date('2026-08-31T10:00:00.000Z'),
      updatedAt: new Date('2026-08-31T10:00:00.000Z'),
      ...input,
    }));
  });

  it('cria caixa aberto com fundo inicial e finishedAt null', async () => {
    const result = await useCase.execute({
      ...currentUser,
      openingAmount: 150.5,
    });

    expect(cashRegisterDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-id',
        locationId: 'location-id',
        status: CashRegisterStatus.OPEN,
        openedByUserId: 'user-id',
        openingAmount: 150.5,
        finishedAt: null,
      }),
    );
    expect(result.status).toBe(CashRegisterStatus.OPEN);
    expect(result.summary).toEqual({
      totalCashPayments: 0,
      totalNonCashPayments: 0,
      byMethod: [],
      paymentsCount: 0,
    });
    expect(result.expectedClosingAmount).toBe(150.5);
  });

  it('não exige turno aberto para abrir o caixa (ADR-1b)', async () => {
    // O usecase não recebe nem consulta LocationShiftDataSource — abrir caixa
    // sem turno aberto tem que funcionar.
    await expect(
      useCase.execute({ ...currentUser, openingAmount: 0 }),
    ).resolves.toEqual(
      expect.objectContaining({ status: CashRegisterStatus.OPEN }),
    );

    expect(useCase).not.toHaveProperty('locationShiftDataSource');
  });

  it('rejeita quando já existe caixa aberto na unidade', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'open-cash-register',
    });

    await expect(
      useCase.execute({ ...currentUser, openingAmount: 100 }),
    ).rejects.toBeInstanceOf(CashRegisterAlreadyOpenException);

    expect(cashRegisterDataSource.createOne).not.toHaveBeenCalled();
  });

  it('busca o caixa aberto isolando por organização e unidade', async () => {
    await useCase.execute({ ...currentUser, openingAmount: 100 });

    expect(cashRegisterDataSource.findOpenByLocation).toHaveBeenCalledWith(
      'org-id',
      'location-id',
    );
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({
        ...currentUser,
        locationId: undefined,
        openingAmount: 100,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(cashRegisterDataSource.createOne).not.toHaveBeenCalled();
  });
});
