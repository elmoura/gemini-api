import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import { CashRegistersModule } from '@modules/cash-registers/cash-registers.module';
import { LocationShift, LocationShiftSchema } from './entities/location-shift';
import { LocationShiftDataSource } from './datasources/location-shift.datasource';
import { LocationShiftsResolver } from './location-shifts.resolver';
import { StartLocationShiftUseCase } from './usecases/start-location-shift.usecase';
import { FinishLocationShiftUseCase } from './usecases/finish-location-shift.usecase';
import { GetCurrentLocationShiftUseCase } from './usecases/get-current-location-shift.usecase';
import { ListLocationShiftsUseCase } from './usecases/list-location-shifts.usecase';

@Module({
  imports: [
    AuthModule,
    CashRegistersModule,
    MongooseModule.forFeature([
      { name: LocationShift.name, schema: LocationShiftSchema },
    ]),
  ],
  providers: [
    LocationShiftsResolver,
    LocationShiftDataSource,
    StartLocationShiftUseCase,
    FinishLocationShiftUseCase,
    GetCurrentLocationShiftUseCase,
    ListLocationShiftsUseCase,
  ],
  exports: [LocationShiftDataSource],
})
export class LocationShiftsModule {}
