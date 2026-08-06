import { Product } from '@modules/products/entities/product';
import { ComplementGroupDataSource } from '@modules/complement-groups/datasources/complement-group.datasource';
import { ComplementDataSource } from '@modules/complement-groups/datasources/complement.datasource';
import { TableOrderItem } from '../entities/table-order-item';
import { TableOrderItemInput } from '../usecases/types/table-order-item.input';
import { formatOrderItem } from './format-order-item';
import { validateAndBuildItemComplements } from './validate-item-complements';

type BuildOrderTabItemParams = {
  itemInput: TableOrderItemInput;
  product: Product;
  organizationId: string;
  locationId: string;
  complementGroupDataSource: ComplementGroupDataSource;
  complementDataSource: ComplementDataSource;
};

export async function buildOrderTabItem({
  itemInput,
  product,
  organizationId,
  locationId,
  complementGroupDataSource,
  complementDataSource,
}: BuildOrderTabItemParams): Promise<TableOrderItem> {
  const complementGroupIds = (product.complementGroups ?? []).map(
    (association) => association.complementGroupId,
  );
  const groups = await complementGroupDataSource.findByIds(complementGroupIds, {
    organizationId,
    locationId,
  });
  const complements = await complementDataSource.listByGroupIds(
    complementGroupIds,
    { organizationId, locationId },
  );

  const complementsSnapshot = validateAndBuildItemComplements({
    product,
    selections: itemInput.complements ?? [],
    groups,
    complements,
  });

  return formatOrderItem(
    {
      quantity: itemInput.quantity,
      observation: itemInput.observation,
      complements: complementsSnapshot,
    },
    product,
  );
}
