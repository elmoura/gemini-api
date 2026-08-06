import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { ComplementDataSource } from '../datasources/complement.datasource';
import { ComplementGroupDataSource } from '../datasources/complement-group.datasource';
import {
  FindComplementInput,
  ListComplementsInput,
} from './types/complement.inputs';
import { ComplementObj } from './types/complement.object';
import { ComplementNotFoundException } from '../errors/complement-not-found';
import { ComplementGroupNotFoundException } from '../errors/complement-group-not-found';

@Injectable()
export class ListComplementsUseCase
  implements IBaseUseCase<ListComplementsInput, ComplementObj[]>
{
  constructor(
    private readonly complementDataSource: ComplementDataSource,
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: ListComplementsInput): Promise<ComplementObj[]> {
    const group = await this.complementGroupDataSource.findById({
      _id: input.complementGroupId,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!group) throw new ComplementGroupNotFoundException();

    return this.complementDataSource.listByGroup(input.complementGroupId, {
      organizationId: input.organizationId,
      locationId: input.locationId,
    });
  }
}

@Injectable()
export class FindComplementUseCase
  implements IBaseUseCase<FindComplementInput, ComplementObj>
{
  constructor(private readonly complementDataSource: ComplementDataSource) {}

  async execute(input: FindComplementInput): Promise<ComplementObj> {
    const complement = await this.complementDataSource.findById({
      _id: input._id,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!complement) throw new ComplementNotFoundException();

    return complement;
  }
}
