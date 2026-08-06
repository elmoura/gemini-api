import { Field, ObjectType } from '@nestjs/graphql';
import { LocationShiftObj } from './location-shift.object';

@ObjectType()
export class ListLocationShiftsOutput {
  @Field()
  limit: number;

  @Field()
  offset: number;

  @Field()
  shiftsCount: number;

  @Field(() => [LocationShiftObj])
  shifts: LocationShiftObj[];
}
