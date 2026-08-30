import { UnauthorizedException } from '@nestjs/common';
import { LocationShiftAlreadyOpenException } from '../errors/location-shift-already-open';
import { LocationShiftStatuses } from '../enums/location-shift-statuses';
import { StartLocationShiftUseCase } from './start-location-shift.usecase';

describe('StartLocationShiftUseCase', () => {
  const locationShiftDataSource = {
    findOpenByLocation: jest.fn(),
    createOne: jest.fn(),
  };

  const useCase = new StartLocationShiftUseCase(
    locationShiftDataSource as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    locationShiftDataSource.findOpenByLocation.mockResolvedValue(null);
    locationShiftDataSource.createOne.mockImplementation(async (input) => ({
      _id: 'shift-id',
      createdAt: new Date('2026-07-13T10:00:00.000Z'),
      updatedAt: new Date('2026-07-13T10:00:00.000Z'),
      ...input,
    }));
  });

  it('cria turno aberto com counters zerados e finishedAt null', async () => {
    const result = await useCase.execute({
      userId: 'user-id',
      organizationId: 'org-id',
      roles: [],
      locationId: 'location-id',
    });

    expect(locationShiftDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-id',
        locationId: 'location-id',
        status: LocationShiftStatuses.OPEN,
        finishedAt: null,
        currentTableOrderQuantity: 0,
        currentOrderTabsQuantity: 0,
      }),
    );
    expect(result.status).toBe(LocationShiftStatuses.OPEN);
  });

  it('rejeita quando já existe turno aberto na unidade', async () => {
    locationShiftDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'open-shift',
    });

    await expect(
      useCase.execute({
        userId: 'user-id',
        organizationId: 'org-id',
        roles: [],
        locationId: 'location-id',
      }),
    ).rejects.toBeInstanceOf(LocationShiftAlreadyOpenException);

    expect(locationShiftDataSource.createOne).not.toHaveBeenCalled();
  });

  it('rejeita quando token não possui locationId', async () => {
    await expect(
      useCase.execute({
        userId: 'user-id',
        organizationId: 'org-id',
        roles: [],
        locationId: undefined,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
