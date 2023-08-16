import { Field, ObjectType } from '@nestjs/graphql';
import { Organization } from '../../entities/organization';
import { OrganizationLocation } from '@modules/organizations/entities/organization-location';
import { OrganizationLocationObj } from './organization-location.object';

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

  @Field(() => [OrganizationLocationObj])
  locations?: OrganizationLocation[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
