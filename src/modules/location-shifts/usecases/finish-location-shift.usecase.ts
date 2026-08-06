import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationShiftDataSource } from '../datasources/location-shift.datasource';
import { LocationShift } from '../entities/location-shift';
import { LocationShiftNotFoundException } from '../errors/location-shift-not-found';

@Injectable()
export class FinishLocationShiftUseCase
  implements IBaseUseCase<CurrentUserData, LocationShift>
{
  constructor(private locationShiftDataSource: LocationShiftDataSource) {}

  async execute(input: CurrentUserData): Promise<LocationShift> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const openShift = await this.locationShiftDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (!openShift) throw new LocationShiftNotFoundException();

    await this.locationShiftDataSource.closeOne(
      openShift._id,
      organizationId,
      new Date(),
    );

    return this.locationShiftDataSource.findById(openShift._id, organizationId);
  }
}
