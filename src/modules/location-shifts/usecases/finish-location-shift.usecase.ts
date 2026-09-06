import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { LocationShiftDataSource } from '../datasources/location-shift.datasource';
import { LocationShift } from '../entities/location-shift';
import { LocationShiftNotFoundException } from '../errors/location-shift-not-found';
import { CashRegisterStillOpenException } from '../errors/cash-register-still-open.exception';
import { CashRegisterDataSource } from '@modules/cash-registers/datasources/cash-register.datasource';

@Injectable()
export class FinishLocationShiftUseCase
  implements IBaseUseCase<CurrentUserData, LocationShift>
{
  constructor(
    private locationShiftDataSource: LocationShiftDataSource,
    private cashRegisterDataSource: CashRegisterDataSource,
  ) {}

  async execute(input: CurrentUserData): Promise<LocationShift> {
    const { organizationId, locationId } = input;

    if (!organizationId || !locationId) throw new UnauthorizedException();

    const openShift = await this.locationShiftDataSource.findOpenByLocation(
      organizationId,
      locationId,
    );

    if (!openShift) throw new LocationShiftNotFoundException();

    // ADR-1b: vínculo unidirecional. O turno não fecha por cima de um caixa
    // aberto — a conferência tem que acontecer antes da equipe ir embora.
    const openCashRegister =
      await this.cashRegisterDataSource.findOpenByLocation(
        organizationId,
        locationId,
      );

    if (openCashRegister) throw new CashRegisterStillOpenException();

    await this.locationShiftDataSource.closeOne(
      openShift._id,
      organizationId,
      new Date(),
    );

    return this.locationShiftDataSource.findById(openShift._id, organizationId);
  }
}
