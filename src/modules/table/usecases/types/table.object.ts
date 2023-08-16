import { Table } from '@modules/table/entities/table';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TableObj implements Table {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  identifier: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
