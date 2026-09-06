import { UnauthorizedException } from '@nestjs/common';
import { CashMovementType } from '../entities/cash-movement';
import { ListCashMovementsUseCase } from './list-cash-movements.usecase';

describe('ListCashMovementsUseCase', () => {
  const cashMovementDataSource = {
    listByCashRegister: jest.fn(),
  };

  const useCase = new ListCashMovementsUseCase(cashMovementDataSource as never);

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    cashMovementDataSource.listByCashRegister.mockResolvedValue([
      {
        _id: 'movement-id',
        cashRegisterId: 'cash-register-id',
        organizationId: 'org-id',
        locationId: 'location-id',
        type: CashMovementType.SUPPLY,
        amount: 50,
        registeredByUserId: 'user-id',
      },
    ]);
  });

  it('lista as movimentações do caixa informado', async () => {
    const result = await useCase.execute({
      ...currentUser,
      cashRegisterId: 'cash-register-id',
    });

    expect(result).toHaveLength(1);
    expect(result[0].cashRegisterId).toBe('cash-register-id');
  });

  it('filtra sempre por organização e unidade do token (multi-tenant)', async () => {
    await useCase.execute({
      ...currentUser,
      cashRegisterId: 'cash-register-id',
    });

    expect(cashMovementDataSource.listByCashRegister).toHaveBeenCalledWith(
      'cash-register-id',
      'org-id',
      'location-id',
    );
  });

  it('devolve lista vazia para caixa de outra organização', async () => {
    cashMovementDataSource.listByCashRegister.mockResolvedValue([]);

    await expect(
      useCase.execute({
        ...currentUser,
        cashRegisterId: 'cash-register-de-outra-org',
      }),
    ).resolves.toEqual([]);
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({
        ...currentUser,
        locationId: undefined,
        cashRegisterId: 'cash-register-id',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(cashMovementDataSource.listByCashRegister).not.toHaveBeenCalled();
  });
});
