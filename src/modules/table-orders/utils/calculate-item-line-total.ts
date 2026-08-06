import { TableOrderItem, TableOrderItemComplement } from '../entities/table-order-item';

export function calculateComplementsUnitTotal(
  complements: TableOrderItemComplement[] = [],
): number {
  return complements.reduce(
    (total, complement) => total + complement.unitPrice * complement.quantity,
    0,
  );
}

export function calculateItemLineTotal(item: Pick<TableOrderItem, 'productPrice' | 'discount' | 'quantity' | 'complements'>): number {
  const unitBase = item.productPrice - (item.discount ?? 0);
  const complementsPerUnit = calculateComplementsUnitTotal(item.complements);

  return (unitBase + complementsPerUnit) * item.quantity;
}
