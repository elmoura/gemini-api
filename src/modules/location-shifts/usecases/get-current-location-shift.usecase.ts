import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationShiftDataSource } from '../datasources/location-shift.datasource';
import { LocationShift } from '../entities/location-shift';

@Injectable()
export class GetCurrentLocationShiftUseCase
  implements IBaseUseCase<CurrentUserData, LocationShift | null>
{
  constructor(private locationShiftDataSource: LocationShiftDataSource) {}

  async execute(input: CurrentUserData): Promise<LocationShift | null> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    return this.locationShiftDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );
  }
}
