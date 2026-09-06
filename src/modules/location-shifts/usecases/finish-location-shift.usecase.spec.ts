import { UnauthorizedException } from '@nestjs/common';
import { CashRegisterStillOpenException } from '../errors/cash-register-still-open.exception';
import { LocationShiftNotFoundException } from '../errors/location-shift-not-found';
import { LocationShiftStatuses } from '../enums/location-shift-statuses';
import { FinishLocationShiftUseCase } from './finish-location-shift.usecase';

describe('FinishLocationShiftUseCase', () => {
  const locationShiftDataSource = {
    findOpenByLocation: jest.fn(),
    closeOne: jest.fn(),
    findById: jest.fn(),
  };
  const cashRegisterDataSource = {
    findOpenByLocation: jest.fn(),
  };

  const useCase = new FinishLocationShiftUseCase(
    locationShiftDataSource as never,
    cashRegisterDataSource as never,
  );

  const currentUser = {
    userId: 'user-id',
    organizationId: 'org-id',
    roles: [],
    locationId: 'location-id',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    locationShiftDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'shift-id',
      status: LocationShiftStatuses.OPEN,
    });
    locationShiftDataSource.closeOne.mockResolvedValue(true);
    locationShiftDataSource.findById.mockResolvedValue({
      _id: 'shift-id',
      status: LocationShiftStatuses.CLOSED,
      finishedAt: new Date('2026-08-31T22:00:00.000Z'),
    });
    // Padrão: caixa já fechado.
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue(null);
  });

  it('fecha o turno normalmente quando não há caixa aberto', async () => {
    const result = await useCase.execute(currentUser);

    expect(locationShiftDataSource.closeOne).toHaveBeenCalledWith(
      'shift-id',
      'org-id',
      expect.any(Date),
    );
    expect(result.status).toBe(LocationShiftStatuses.CLOSED);
  });

  it('rejeita o fechamento enquanto houver caixa aberto na unidade (ADR-1b)', async () => {
    cashRegisterDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'cash-register-id',
    });

    await expect(useCase.execute(currentUser)).rejects.toBeInstanceOf(
      CashRegisterStillOpenException,
    );

    expect(locationShiftDataSource.closeOne).not.toHaveBeenCalled();
  });

  it('consulta o caixa isolando por organização e unidade', async () => {
    await useCase.execute(currentUser);

    expect(cashRegisterDataSource.findOpenByLocation).toHaveBeenCalledWith(
      'org-id',
      'location-id',
    );
  });

  it('rejeita quando não há turno aberto na unidade', async () => {
    locationShiftDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(useCase.execute(currentUser)).rejects.toBeInstanceOf(
      LocationShiftNotFoundException,
    );

    expect(cashRegisterDataSource.findOpenByLocation).not.toHaveBeenCalled();
    expect(locationShiftDataSource.closeOne).not.toHaveBeenCalled();
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({ ...currentUser, locationId: undefined }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    expect(locationShiftDataSource.closeOne).not.toHaveBeenCalled();
  });

  it('não adiciona nenhum campo de caixa ao turno persistido', async () => {
    const result = await useCase.execute(currentUser);

    // LocationShift permanece sem qualquer campo de CashRegister: o vínculo é
    // só de validação, não de composição (ADR-1b).
    expect(result).not.toHaveProperty('cashRegisterId');
    expect(result).not.toHaveProperty('cashRegister');
    expect(locationShiftDataSource.closeOne).toHaveBeenCalledWith(
      'shift-id',
      'org-id',
      expect.any(Date),
    );
  });
});
