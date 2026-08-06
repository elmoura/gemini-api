import { Field, ObjectType } from '@nestjs/graphql';
import { Complement } from '../../entities/complement';

@ObjectType()
export class ComplementObj implements Complement {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  complementGroupId: string;

  @Field()
  name: string;

  @Field()
  additionalPrice: number;

  @Field()
  displayOrder: number;

  @Field()
  minQuantity: number;

  @Field()
  maxQuantity: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
