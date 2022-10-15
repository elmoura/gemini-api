import { Field, ObjectType } from '@nestjs/graphql';
import { Organization } from '../../entities/organization';

@ObjectType()
export class OrganizationObj implements Organization {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  businessSegment: string;

  @Field({ nullable: true })
  businessRepresentantId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
