import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { StartLocationShiftUseCase } from './usecases/start-location-shift.usecase';
import { FinishLocationShiftUseCase } from './usecases/finish-location-shift.usecase';
import { LocationShiftObj } from './usecases/types/location-shift.object';
import { GetCurrentLocationShiftUseCase } from './usecases/get-current-location-shift.usecase';
import { ListLocationShiftsUseCase } from './usecases/list-location-shifts.usecase';
import { ListLocationShiftsInput } from './usecases/types/list-location-shifts.input';
import { ListLocationShiftsOutput } from './usecases/types/list-location-shifts.output';

@Resolver()
@UseGuards(AuthGuard)
export class LocationShiftsResolver {
  constructor(
    private startLocationShiftUseCase: StartLocationShiftUseCase,
    private finishLocationShiftUseCase: FinishLocationShiftUseCase,
    private getCurrentLocationShiftUseCase: GetCurrentLocationShiftUseCase,
    private listLocationShiftsUseCase: ListLocationShiftsUseCase,
  ) {}

  @Mutation(() => LocationShiftObj)
  startLocationShift(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<LocationShiftObj> {
    return this.startLocationShiftUseCase.execute(currentUserData);
  }

  @Mutation(() => LocationShiftObj)
  finishLocationShift(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<LocationShiftObj> {
    return this.finishLocationShiftUseCase.execute(currentUserData);
  }

  @Query(() => LocationShiftObj, { nullable: true })
  getCurrentLocationShift(
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<LocationShiftObj | null> {
    return this.getCurrentLocationShiftUseCase.execute(currentUserData);
  }

  @Query(() => ListLocationShiftsOutput)
  listLocationShifts(
    @Args('input') input: ListLocationShiftsInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<ListLocationShiftsOutput> {
    return this.listLocationShiftsUseCase.execute({
      ...input,
      ...currentUserData,
    });
  }
}
