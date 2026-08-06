import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationShiftDataSource } from '../datasources/location-shift.datasource';
import { ListLocationShiftsInput } from './types/list-location-shifts.input';
import { ListLocationShiftsOutput } from './types/list-location-shifts.output';

@Injectable()
export class ListLocationShiftsUseCase
  implements
    IBaseUseCase<
      ListLocationShiftsInput & CurrentUserData,
      ListLocationShiftsOutput
    >
{
  constructor(private locationShiftDataSource: LocationShiftDataSource) {}

  async execute(
    input: ListLocationShiftsInput & CurrentUserData,
  ): Promise<ListLocationShiftsOutput> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const {
      limit = 20,
      offset = 0,
      startedAtFrom,
      startedAtTo,
      finishedAtFrom,
      finishedAtTo,
    } = input;

    const { shifts, totalCount } =
      await this.locationShiftDataSource.listByLocationAndFilters(
        organizationId,
        locationId,
        {
          limit,
          offset,
          startedAtFrom,
          startedAtTo,
          finishedAtFrom,
          finishedAtTo,
        },
      );

    return {
      limit,
      offset,
      shiftsCount: totalCount,
      shifts,
    };
  }
}
