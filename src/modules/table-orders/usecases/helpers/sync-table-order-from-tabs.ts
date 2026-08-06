import { OrderTabDataSource } from '../../datasources/order-tab.datasource';
import { TableOrderDataSource } from '../../datasources/table-order.datasource';
import { consolidateTableOrderFromTabs } from '../../utils/consolidate-table-order-from-tabs';

export async function syncTableOrderFromTabs(
  tableOrderId: string,
  organizationId: string,
  orderTabDataSource: OrderTabDataSource,
  tableOrderDataSource: TableOrderDataSource,
): Promise<void> {
  const tabs = await orderTabDataSource.findByTableOrderId(
    tableOrderId,
    organizationId,
  );
  const consolidated = consolidateTableOrderFromTabs(tabs);

  await tableOrderDataSource.updateOne(tableOrderId, organizationId, {
    pricing: consolidated.pricing,
    payment: consolidated.payment,
  });
}
