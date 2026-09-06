import { UnauthorizedException } from '@nestjs/common';
import { CashMovementType } from '../entities/cash-movement';
import { CashRegisterStatus } from '../entities/cash-register';
import { CashRegisterNotOpenException } from '../errors/cash-register-not-open.exception';
import { RegisterCashMovementUseCase } from './register-cash-movement.usecase';

describe('RegisterCashMovementUseCase', () => {
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
  };
  const cashMovementDataSource = {
    createOne: jest.fn(),
  };

  const useCase = new RegisterCashMovementUseCase(
    cashRegisterDataSource as never,
    cashMovementDataSource as never,
  );

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'cash-register-id',
      organizationId: 'org-id',
      locationId: 'location-id',
      status: CashRegisterStatus.OPEN,
    });
    cashMovementDataSource.createOne.mockImplementation(async (input) => ({
      _id: 'movement-id',
      createdAt: new Date('2026-08-31T12:00:00.000Z'),
      updatedAt: new Date('2026-08-31T12:00:00.000Z'),
      ...input,
    }));
  });

  it('registra sangria vinculada ao caixa aberto da unidade', async () => {
    const result = await useCase.execute({
      ...currentUser,
      type: CashMovementType.WITHDRAWAL,
      amount: 80.555,
      reason: 'Pagamento de fornecedor',
    });

    expect(cashMovementDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        cashRegisterId: 'cash-register-id',
        organizationId: 'org-id',
        locationId: 'location-id',
        type: CashMovementType.WITHDRAWAL,
        amount: 80.56,
        reason: 'Pagamento de fornecedor',
        registeredByUserId: 'user-id',
      }),
    );
    expect(result._id).toBe('movement-id');
  });

  it('registra suprimento sem motivo informado', async () => {
    await useCase.execute({
      ...currentUser,
      type: CashMovementType.SUPPLY,
      amount: 50,
    });

    expect(cashMovementDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CashMovementType.SUPPLY,
        amount: 50,
        reason: undefined,
      }),
    );
  });

  it('rejeita quando não há caixa aberto na unidade', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(
      useCase.execute({
        ...currentUser,
        type: CashMovementType.WITHDRAWAL,
        amount: 50,
      }),
    ).rejects.toBeInstanceOf(CashRegisterNotOpenException);

    expect(cashMovementDataSource.createOne).not.toHaveBeenCalled();
  });

  it('busca o caixa aberto isolando por organização e unidade', async () => {
    await useCase.execute({
      ...currentUser,
      type: CashMovementType.SUPPLY,
      amount: 10,
    });

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
        type: CashMovementType.SUPPLY,
        amount: 10,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(cashMovementDataSource.createOne).not.toHaveBeenCalled();
  });
});
