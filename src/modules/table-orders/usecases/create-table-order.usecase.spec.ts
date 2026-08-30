import { CreateTableOrderUseCase } from './create-table-order.usecase';
import { NoOpenLocationShiftException } from '@modules/location-shifts/errors/no-open-location-shift';
import {
  TableOrderPaymentStatuses,
  TableOrderStatuses,
} from '../enums/table-order-statuses';

describe('CreateTableOrderUseCase', () => {
  const tableDataSource = {
    findByTableAndOrgId: jest.fn(),
  };
  const tableOrderDataSource = {
    findOpenByTableId: jest.fn(),
    createOne: jest.fn(),
  };
  const locationShiftDataSource = {
    findOpenByLocation: jest.fn(),
    incrementTableOrderQuantity: jest.fn(),
  };

  const useCase = new CreateTableOrderUseCase(
    tableDataSource as never,
    tableOrderDataSource as never,
    locationShiftDataSource as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    tableDataSource.findByTableAndOrgId.mockResolvedValue({
      _id: 'table-id',
      identifier: 'Mesa 1',
    });
    tableOrderDataSource.findOpenByTableId.mockResolvedValue(null);
    locationShiftDataSource.findOpenByLocation.mockResolvedValue({
      _id: 'shift-id',
    });
    tableOrderDataSource.createOne.mockImplementation(async (input) => ({
      _id: 'order-id',
      createdAt: new Date('2026-07-13T10:00:00.000Z'),
      updatedAt: new Date('2026-07-13T10:00:00.000Z'),
      ...input,
    }));
  });

  it('rejeita abertura de mesa quando não há turno aberto', async () => {
    locationShiftDataSource.findOpenByLocation.mockResolvedValue(null);

    await expect(
      useCase.execute({
        tableId: 'table-id',
        organizationId: 'org-id',
        locationId: 'location-id',
        userId: 'user-id',
        roles: [],
      }),
    ).rejects.toBeInstanceOf(NoOpenLocationShiftException);

    expect(tableOrderDataSource.createOne).not.toHaveBeenCalled();
    expect(
      locationShiftDataSource.incrementTableOrderQuantity,
    ).not.toHaveBeenCalled();
  });

  it('incrementa contador do turno aberto após criar mesa com sucesso', async () => {
    const result = await useCase.execute({
      tableId: 'table-id',
      organizationId: 'org-id',
      locationId: 'location-id',
      userId: 'user-id',
      roles: [],
    });

    expect(tableOrderDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        status: TableOrderStatuses.IN_ATTENDANCE,
        payment: expect.objectContaining({
          paymentStatus: TableOrderPaymentStatuses.PENDING,
        }),
      }),
    );
    expect(
      locationShiftDataSource.incrementTableOrderQuantity,
    ).toHaveBeenCalledWith('shift-id', 'org-id');
    expect(result._id).toBe('order-id');
  });
});
