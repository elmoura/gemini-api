import { TableOrderItem } from '@modules/table-orders/entities/table-order-item';
import { TableOrderItemInput } from '@modules/table-orders/usecases/types/table-order-item.input';
import { areItemComplementsEqual } from '@modules/table-orders/utils/complements-fingerprint';

export type BatchAffectedItem = {
  itemId: string;
  productName: string;
  quantity: number;
  observation?: string;
  complements: Array<{ name: string; quantity: number }>;
};

function normalizeObservation(value?: string): string {
  return (value ?? '').toLowerCase().trim();
}

function findMatchingItem(
  items: TableOrderItem[],
  input: TableOrderItemInput,
): TableOrderItem | undefined {
  return items.find(
    (item) =>
      item.productId === input.productId &&
      normalizeObservation(item.observation) ===
        normalizeObservation(input.observation) &&
      areItemComplementsEqual(item.complements, input.complements ?? []),
  );
}

export function computeBatchAffectedItems(
  itemsBefore: TableOrderItem[],
  itemsAfter: TableOrderItem[],
  inputItems: TableOrderItemInput[],
): BatchAffectedItem[] {
  return inputItems.map((input) => {
    const beforeMatch = findMatchingItem(itemsBefore, input);
    const afterMatch = findMatchingItem(itemsAfter, input);

    if (!afterMatch) {
      throw new Error('Batch item not found after persistence');
    }

    const quantity = beforeMatch
      ? input.quantity
      : afterMatch.quantity;

    return {
      itemId: afterMatch._id.toString(),
      productName: afterMatch.productName ?? 'Produto',
      quantity,
      observation: afterMatch.observation,
      complements: (afterMatch.complements ?? []).map((complement) => ({
        name: complement.name,
        quantity: complement.quantity,
      })),
    };
  });
}
