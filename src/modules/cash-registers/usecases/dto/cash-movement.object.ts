import { Field, ObjectType } from '@nestjs/graphql';
import { CashMovement, CashMovementType } from '../../entities/cash-movement';

@ObjectType()
export class CashMovementObj implements CashMovement {
  @Field()
  _id: string;

  @Field()
  cashRegisterId: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field(() => CashMovementType)
  type: CashMovementType;

  @Field()
  amount: number;

  @Field({ nullable: true })
  reason?: string;

  @Field()
  registeredByUserId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
