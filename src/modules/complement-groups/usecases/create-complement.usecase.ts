import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ComplementDataSource } from '../datasources/complement.datasource';
import { ComplementGroupDataSource } from '../datasources/complement-group.datasource';
import { CreateComplementInput } from './types/create-complement.input';
import { ComplementObj } from './types/complement.object';
import { ComplementGroupNotFoundException } from '../errors/complement-group-not-found';
import { validateComplementQuantityConfig } from '../utils/validate-complement-group-config';

@Injectable()
export class CreateComplementUseCase
  implements IBaseUseCase<CreateComplementInput, ComplementObj>
{
  constructor(
    private readonly complementDataSource: ComplementDataSource,
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: CreateComplementInput): Promise<ComplementObj> {
    const group = await this.complementGroupDataSource.findById({
      _id: input.complementGroupId,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!group) throw new ComplementGroupNotFoundException();

    const minQuantity = input.minQuantity ?? 0;
    const maxQuantity = input.maxQuantity ?? 1;

    validateComplementQuantityConfig(minQuantity, maxQuantity);

    return this.complementDataSource.createOne({
      organizationId: input.organizationId,
      locationId: input.locationId,
      complementGroupId: input.complementGroupId,
      name: input.name,
      additionalPrice: input.additionalPrice ?? 0,
      displayOrder: input.displayOrder ?? 0,
      minQuantity,
      maxQuantity,
    });
  }
}
