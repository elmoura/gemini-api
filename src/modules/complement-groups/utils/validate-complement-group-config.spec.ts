import { validateComplementGroupConfig } from './validate-complement-group-config';
import { ComplementSelectionType } from '../enums/complement-selection-type';
import { InvalidComplementGroupConfigException } from '../errors/invalid-complement-group-config';

describe('validateComplementGroupConfig', () => {
  it('aceita configuração válida', () => {
    expect(() =>
      validateComplementGroupConfig({
        minSelections: 0,
        maxSelections: 2,
        selectionType: ComplementSelectionType.MULTIPLE,
      }),
    ).not.toThrow();
  });

  it('rejeita minSelections maior que maxSelections', () => {
    expect(() =>
      validateComplementGroupConfig({
        minSelections: 3,
        maxSelections: 1,
        selectionType: ComplementSelectionType.MULTIPLE,
      }),
    ).toThrow(InvalidComplementGroupConfigException);
  });
});
