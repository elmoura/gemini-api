import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CurrentUserData } from '@shared/decorators/current-user';
import { ComplementGroupDataSource } from '../datasources/complement-group.datasource';
import { ComplementGroupObj } from './types/complement-group.object';
import { FindComplementGroupInput } from './types/find-complement-group.input';
import { ComplementGroupNotFoundException } from '../errors/complement-group-not-found';

@Injectable()
export class ListComplementGroupsUseCase
  implements IBaseUseCase<CurrentUserData, ComplementGroupObj[]>
{
  constructor(
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: CurrentUserData): Promise<ComplementGroupObj[]> {
    return this.complementGroupDataSource.listByLocation({
      organizationId: input.organizationId,
      locationId: input.locationId,
    });
  }
}

@Injectable()
export class FindComplementGroupUseCase
  implements IBaseUseCase<FindComplementGroupInput, ComplementGroupObj>
{
  constructor(
    private readonly complementGroupDataSource: ComplementGroupDataSource,
  ) {}

  async execute(input: FindComplementGroupInput): Promise<ComplementGroupObj> {
    const group = await this.complementGroupDataSource.findById({
      _id: input._id,
      organizationId: input.organizationId,
      locationId: input.locationId,
    });

    if (!group) throw new ComplementGroupNotFoundException();

    return group;
  }
}
