import { ComplementGroup } from '../entities/complement-group';
import { ComplementSelectionType } from '../enums/complement-selection-type';
import { InvalidComplementGroupConfigException } from '../errors/invalid-complement-group-config';

type ValidateGroupConfigInput = Pick<
  ComplementGroup,
  'minSelections' | 'maxSelections' | 'selectionType'
>;

export function validateComplementGroupConfig(
  input: ValidateGroupConfigInput,
): void {
  if (input.minSelections > input.maxSelections) {
    throw new InvalidComplementGroupConfigException(
      'minSelections não pode ser maior que maxSelections',
    );
  }

  if (input.minSelections < 0 || input.maxSelections < 0) {
    throw new InvalidComplementGroupConfigException(
      'minSelections e maxSelections devem ser maiores ou iguais a zero',
    );
  }

  if (
    input.selectionType === ComplementSelectionType.SINGLE &&
    input.maxSelections > 1
  ) {
    throw new InvalidComplementGroupConfigException(
      'Grupos com seleção única devem ter maxSelections igual a 1',
    );
  }
}

export function validateComplementQuantityConfig(
  minQuantity: number,
  maxQuantity: number,
): void {
  if (minQuantity > maxQuantity) {
    throw new InvalidComplementGroupConfigException(
      'minQuantity não pode ser maior que maxQuantity',
    );
  }

  if (minQuantity < 0 || maxQuantity < 0) {
    throw new InvalidComplementGroupConfigException(
      'minQuantity e maxQuantity devem ser maiores ou iguais a zero',
    );
  }
}
