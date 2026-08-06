import { TableDataSource } from './table.datasource';
import { TableOrderStatuses } from '@modules/table-orders/enums/table-order-statuses';

describe('TableDataSource', () => {
  const tableModel = {
    find: jest.fn(),
  };
  const tableOrderModel = {
    distinct: jest.fn(),
  };

  const dataSource = new TableDataSource(
    tableModel as never,
    tableOrderModel as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAvailableByOrgAndLocationIds', () => {
    it('exclui mesas com pedidos em atendimento', async () => {
      tableOrderModel.distinct.mockResolvedValue(['table-1']);
      tableModel.find.mockResolvedValue([
        { _id: 'table-2', identifier: 'Mesa 2' },
      ]);

      const result = await dataSource.listAvailableByOrgAndLocationIds(
        'org-id',
        'location-id',
      );

      expect(tableOrderModel.distinct).toHaveBeenCalledWith('table._id', {
        organizationId: 'org-id',
        locationId: 'location-id',
        status: TableOrderStatuses.IN_ATTENDANCE,
      });
      expect(tableModel.find).toHaveBeenCalledWith({
        organizationId: 'org-id',
        locationId: 'location-id',
        _id: { $nin: ['table-1'] },
      });
      expect(result).toEqual([{ _id: 'table-2', identifier: 'Mesa 2' }]);
    });

    it('retorna todas as mesas quando não há pedidos em atendimento', async () => {
      tableOrderModel.distinct.mockResolvedValue([]);
      tableModel.find.mockResolvedValue([
        { _id: 'table-1', identifier: 'Mesa 1' },
        { _id: 'table-2', identifier: 'Mesa 2' },
      ]);

      const result = await dataSource.listAvailableByOrgAndLocationIds(
        'org-id',
        'location-id',
      );

      expect(tableModel.find).toHaveBeenCalledWith({
        organizationId: 'org-id',
        locationId: 'location-id',
        _id: { $nin: [] },
      });
      expect(result).toHaveLength(2);
    });
  });
});
