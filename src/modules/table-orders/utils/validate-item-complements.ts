import { BadRequestException } from '@nestjs/common';
import { Complement } from '@modules/complement-groups/entities/complement';
import { ComplementGroup } from '@modules/complement-groups/entities/complement-group';
import { ComplementSelectionType } from '@modules/complement-groups/enums/complement-selection-type';
import { Product } from '@modules/products/entities/product';
import { TableOrderItemComplement } from '../entities/table-order-item';

export type ComplementSelectionInput = {
  complementId: string;
  quantity: number;
};

type ValidateItemComplementsParams = {
  product: Product;
  selections: ComplementSelectionInput[];
  groups: ComplementGroup[];
  complements: Complement[];
};

export function validateAndBuildItemComplements({
  product,
  selections,
  groups,
  complements,
}: ValidateItemComplementsParams): TableOrderItemComplement[] {
  if (!product.isActive) {
    throw new BadRequestException('Produto indisponível para novos pedidos');
  }

  const groupsById = new Map(groups.map((group) => [group._id.toString(), group]));
  const complementsById = new Map(
    complements.map((complement) => [complement._id.toString(), complement]),
  );

  const productGroupIds = (product.complementGroups ?? []).map(
    (association) => association.complementGroupId,
  );
  const selectionsByGroup = new Map<string, ComplementSelectionInput[]>();

  for (const selection of selections) {
    const complement = complementsById.get(selection.complementId);

    if (!complement) {
      throw new BadRequestException(
        `Complemento inválido: ${selection.complementId}`,
      );
    }

    if (!productGroupIds.includes(complement.complementGroupId)) {
      throw new BadRequestException(
        `Complemento não vinculado ao produto: ${complement.name}`,
      );
    }

    if (
      selection.quantity < complement.minQuantity ||
      selection.quantity > complement.maxQuantity
    ) {
      throw new BadRequestException(
        `Quantidade inválida para ${complement.name}. Permitido entre ${complement.minQuantity} e ${complement.maxQuantity}`,
      );
    }

    const groupSelections =
      selectionsByGroup.get(complement.complementGroupId) ?? [];
    groupSelections.push(selection);
    selectionsByGroup.set(complement.complementGroupId, groupSelections);
  }

  for (const groupId of productGroupIds) {
    const group = groupsById.get(groupId);
    if (!group) continue;

    const groupSelections = selectionsByGroup.get(groupId) ?? [];
    const totalQuantity = groupSelections.reduce(
      (sum, selection) => sum + selection.quantity,
      0,
    );
    const optionCount = groupSelections.length;

    if (totalQuantity < group.minSelections) {
      throw new BadRequestException(
        `Seleções abaixo do mínimo no grupo ${group.name}`,
      );
    }

    if (totalQuantity > group.maxSelections) {
      throw new BadRequestException(
        `Seleções acima do máximo no grupo ${group.name}`,
      );
    }

    if (group.selectionType === ComplementSelectionType.SINGLE) {
      if (optionCount > 1 || totalQuantity > 1) {
        throw new BadRequestException(
          `Grupo ${group.name} permite apenas uma seleção`,
        );
      }
    }
  }

  const unknownGroupSelections = [...selectionsByGroup.keys()].filter(
    (groupId) => !productGroupIds.includes(groupId),
  );

  if (unknownGroupSelections.length > 0) {
    throw new BadRequestException('Complementos de grupos não vinculados ao produto');
  }

  return selections.map((selection) => {
    const complement = complementsById.get(selection.complementId)!;

    return {
      complementId: complement._id.toString(),
      complementGroupId: complement.complementGroupId,
      name: complement.name,
      unitPrice: complement.additionalPrice,
      quantity: selection.quantity,
    };
  });
}
