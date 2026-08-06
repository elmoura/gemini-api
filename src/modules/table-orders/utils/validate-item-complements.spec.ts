import { ComplementSelectionType } from '@modules/complement-groups/enums/complement-selection-type';
import { validateAndBuildItemComplements } from './validate-item-complements';
import { Product } from '@modules/products/entities/product';
import { ComplementGroup } from '@modules/complement-groups/entities/complement-group';
import { Complement } from '@modules/complement-groups/entities/complement';

const product: Product = {
  _id: 'product-1',
  organizationId: 'org-1',
  locationId: 'loc-1',
  isActive: true,
  name: 'X-Burger',
  originalPrice: 25,
  images: [],
  complementGroups: [
    { complementGroupId: 'group-1', label: 'Que tal um adicional?' },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const group: ComplementGroup = {
  _id: 'group-1',
  organizationId: 'org-1',
  locationId: 'loc-1',
  name: 'Adicionais',
  minSelections: 1,
  maxSelections: 3,
  selectionType: ComplementSelectionType.MULTIPLE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const bacon: Complement = {
  _id: 'comp-bacon',
  organizationId: 'org-1',
  locationId: 'loc-1',
  complementGroupId: 'group-1',
  name: 'Bacon',
  additionalPrice: 4,
  displayOrder: 0,
  minQuantity: 1,
  maxQuantity: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('validateAndBuildItemComplements', () => {
  it('monta snapshot quando seleção é válida', () => {
    const result = validateAndBuildItemComplements({
      product,
      selections: [{ complementId: 'comp-bacon', quantity: 2 }],
      groups: [group],
      complements: [bacon],
    });

    expect(result).toEqual([
      {
        complementId: 'comp-bacon',
        complementGroupId: 'group-1',
        name: 'Bacon',
        unitPrice: 4,
        quantity: 2,
      },
    ]);
  });

  it('rejeita grupo com minSelections sem seleção', () => {
    expect(() =>
      validateAndBuildItemComplements({
        product,
        selections: [],
        groups: [group],
        complements: [bacon],
      }),
    ).toThrow('Seleções abaixo do mínimo');
  });

  it('rejeita complemento fora do produto', () => {
    expect(() =>
      validateAndBuildItemComplements({
        product: { ...product, complementGroups: [] },
        selections: [{ complementId: 'comp-bacon', quantity: 1 }],
        groups: [group],
        complements: [bacon],
      }),
    ).toThrow('não vinculado ao produto');
  });
});
