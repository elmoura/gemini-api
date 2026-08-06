import { TableOrderItemComplement } from '../entities/table-order-item';
import { ComplementSelectionInput } from './validate-item-complements';

export function buildComplementsFingerprint(
  complements: ComplementSelectionInput[] | TableOrderItemComplement[] = [],
): string {
  return [...complements]
    .map((complement) => `${complement.complementId}:${complement.quantity}`)
    .sort()
    .join('|');
}

export function areItemComplementsEqual(
  left: TableOrderItemComplement[] = [],
  right: ComplementSelectionInput[] = [],
): boolean {
  return buildComplementsFingerprint(left) === buildComplementsFingerprint(right);
}
