import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationNotSetException } from '@shared/errors/location-not-set.exception';
import { ComplementGroupDataSource } from '../datasources/complement-group.datasource';
import { CreateComplementGroupInput } from './types/create-complement-group.input';
import { ComplementGroupObj } from './types/complement-group.object';
import { ComplementSelectionType } from '../enums/complement-selection-type';
import { validateComplementGroupConfig } from '../utils/validate-complement-group-config';

@Injectable()
export class CreateComplementGroupUseCase
  implements IBaseUseCase<CreateComplementGroupInput, ComplementGroupObj>
{
  constructor(
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: CreateComplementGroupInput): Promise<ComplementGroupObj> {
    if (!input.locationId) throw new LocationNotSetException();

    const selectionType =
      input.selectionType ?? ComplementSelectionType.MULTIPLE;
    const maxSelections =
      selectionType === ComplementSelectionType.SINGLE
        ? 1
        : (input.maxSelections ?? 1);
    const minSelections = input.minSelections ?? 0;

    validateComplementGroupConfig({
      minSelections,
      maxSelections,
      selectionType,
    });

    return this.complementGroupDataSource.createOne({
      organizationId: input.organizationId,
      locationId: input.locationId,
      name: input.name,
      minSelections,
      maxSelections,
      selectionType,
    });
  }
}
