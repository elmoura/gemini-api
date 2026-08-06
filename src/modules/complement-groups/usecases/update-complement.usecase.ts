import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ComplementDataSource } from '../datasources/complement.datasource';
import { UpdateComplementInput } from './types/update-complement.input';
import { ComplementObj } from './types/complement.object';
import { ComplementNotFoundException } from '../errors/complement-not-found';
import { validateComplementQuantityConfig } from '../utils/validate-complement-group-config';

@Injectable()
export class UpdateComplementUseCase
  implements IBaseUseCase<UpdateComplementInput, ComplementObj>
{
  constructor(
    private readonly complementDataSource: ComplementDataSource,
  ) {}

  async execute(input: UpdateComplementInput): Promise<ComplementObj> {
    const existing = await this.complementDataSource.findById({
      _id: input._id,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!existing) throw new ComplementNotFoundException();

    const minQuantity = input.minQuantity ?? existing.minQuantity;
    const maxQuantity = input.maxQuantity ?? existing.maxQuantity;

    validateComplementQuantityConfig(minQuantity, maxQuantity);

    const updated = await this.complementDataSource.updateOne(
      {
        _id: input._id,
        organizationId: input.organizationId,
        locationId: input.locationId,
      },
      {
        ...input,
        minQuantity,
        maxQuantity,
      },
    );

    if (!updated) throw new ComplementNotFoundException();

    return updated;
  }
}
