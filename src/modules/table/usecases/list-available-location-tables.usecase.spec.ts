import { ForbiddenException } from '@nestjs/common';
import { ListAvailableLocationTablesUseCase } from './list-available-location-tables.usecase';

describe('ListAvailableLocationTablesUseCase', () => {
  const tableDataSource = {
    listAvailableByOrgAndLocationIds: jest.fn(),
  };
  const organizationExistsUseCase = {
    execute: jest.fn(),
  };
  const organizationLocationExistsUseCase = {
    execute: jest.fn(),
  };

  const useCase = new ListAvailableLocationTablesUseCase(
    tableDataSource as never,
    organizationExistsUseCase as never,
    organizationLocationExistsUseCase as never,
  );

  const currentUser = {
    organizationId: 'org-id',
    locationId: 'location-id',
    userId: 'user-id',
    roles: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizationExistsUseCase.execute.mockResolvedValue(true);
    organizationLocationExistsUseCase.execute.mockResolvedValue(true);
    tableDataSource.listAvailableByOrgAndLocationIds.mockResolvedValue([
      { _id: 'table-1', identifier: 'Mesa 1' },
    ]);
  });

  it('retorna mesas disponíveis quando org e localização são válidas', async () => {
    const result = await useCase.execute(currentUser);

    expect(result).toEqual([{ _id: 'table-1', identifier: 'Mesa 1' }]);
    expect(
      tableDataSource.listAvailableByOrgAndLocationIds,
    ).toHaveBeenCalledWith('org-id', 'location-id');
  });

  it('lança ForbiddenException quando organização não existe', async () => {
    organizationExistsUseCase.execute.mockResolvedValue(false);

    await expect(useCase.execute(currentUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(
      tableDataSource.listAvailableByOrgAndLocationIds,
    ).not.toHaveBeenCalled();
  });

  it('lança ForbiddenException quando localização não existe', async () => {
    organizationLocationExistsUseCase.execute.mockResolvedValue(false);

    await expect(useCase.execute(currentUser)).rejects.toBeInstanceOf(
      ForbiddenException,
    );

    expect(
      tableDataSource.listAvailableByOrgAndLocationIds,
    ).not.toHaveBeenCalled();
  });
});
