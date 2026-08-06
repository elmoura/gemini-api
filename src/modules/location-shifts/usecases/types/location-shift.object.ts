import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LocationShift } from '../../entities/location-shift';
import { LocationShiftStatuses } from '../../enums/location-shift-statuses';

registerEnumType(LocationShiftStatuses, { name: 'LocationShiftStatuses' });

@ObjectType()
export class LocationShiftObj implements LocationShift {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field(() => LocationShiftStatuses)
  status: LocationShiftStatuses;

  @Field()
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  finishedAt: Date | null;

  @Field()
  currentTableOrderQuantity: number;

  @Field()
  currentOrderTabsQuantity: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
