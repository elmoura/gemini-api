import { Injectable } from '@nestjs/common';
import { ComplementGroupDataSource } from '@modules/complement-groups/datasources/complement-group.datasource';
import { BadRequestException } from '@nestjs/common';
import { ProductComplementGroupInput } from '../usecases/dto/product-complement-group.dto';

@Injectable()
export class ProductComplementGroupsValidation {
  constructor(
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(params: {
    organizationId: string;
    locationId: string;
    complementGroups: ProductComplementGroupInput[];
  }): Promise<void> {
    if (!params.complementGroups?.length) return;

    const complementGroupIds = params.complementGroups.map(
      (association) => association.complementGroupId,
    );

    const duplicateIds = complementGroupIds.filter(
      (id, index) => complementGroupIds.indexOf(id) !== index,
    );

    if (duplicateIds.length > 0) {
      throw new BadRequestException(
        `Grupos de complementos duplicados: ${[...new Set(duplicateIds)].join(', ')}`,
      );
    }

    const groups = await this.complementGroupDataSource.findByIds(
      complementGroupIds,
      {
        organizationId: params.organizationId,
        locationId: params.locationId,
      },
    );

    const foundIds = new Set(groups.map((group) => group._id.toString()));
    const invalidIds = complementGroupIds.filter((id) => !foundIds.has(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Grupos de complementos inválidos: ${invalidIds.join(', ')}`,
      );
    }
  }
}
