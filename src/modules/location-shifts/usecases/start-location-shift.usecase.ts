import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationShiftDataSource } from '../datasources/location-shift.datasource';
import { LocationShift } from '../entities/location-shift';
import { LocationShiftAlreadyOpenException } from '../errors/location-shift-already-open';
import { LocationShiftStatuses } from '../enums/location-shift-statuses';

@Injectable()
export class StartLocationShiftUseCase
  implements IBaseUseCase<CurrentUserData, LocationShift>
{
  constructor(private locationShiftDataSource: LocationShiftDataSource) {}

  async execute(input: CurrentUserData): Promise<LocationShift> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const existing = await this.locationShiftDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (existing) throw new LocationShiftAlreadyOpenException();

    return this.locationShiftDataSource.createOne({
      organizationId,
      locationId,
      status: LocationShiftStatuses.OPEN,
      startedAt: new Date(),
      finishedAt: null,
      currentTableOrderQuantity: 0,
      currentOrderTabsQuantity: 0,
    });
  }
}
