import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ComplementGroupDataSource } from '../datasources/complement-group.datasource';
import { UpdateComplementGroupInput } from './types/update-complement-group.input';
import { ComplementGroupObj } from './types/complement-group.object';
import { ComplementGroupNotFoundException } from '../errors/complement-group-not-found';
import { ComplementSelectionType } from '../enums/complement-selection-type';
import { validateComplementGroupConfig } from '../utils/validate-complement-group-config';

@Injectable()
export class UpdateComplementGroupUseCase
  implements IBaseUseCase<UpdateComplementGroupInput, ComplementGroupObj>
{
  constructor(
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: UpdateComplementGroupInput): Promise<ComplementGroupObj> {
    const existing = await this.complementGroupDataSource.findById({
      _id: input._id,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!existing) throw new ComplementGroupNotFoundException();

    const selectionType = input.selectionType ?? existing.selectionType;
    const maxSelections =
      selectionType === ComplementSelectionType.SINGLE
        ? 1
        : (input.maxSelections ?? existing.maxSelections);
    const minSelections = input.minSelections ?? existing.minSelections;

    validateComplementGroupConfig({
      minSelections,
      maxSelections,
      selectionType,
    });

    const updated = await this.complementGroupDataSource.updateOne(
      {
        _id: input._id,
        organizationId: input.organizationId,
        locationId: input.locationId,
      },
      {
        ...input,
        minSelections,
        maxSelections,
        selectionType,
      },
    );

    if (!updated) throw new ComplementGroupNotFoundException();

    return updated;
  }
}
