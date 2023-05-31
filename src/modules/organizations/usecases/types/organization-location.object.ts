import { OrganizationLocation } from '@modules/organizations/entities/organization-location';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrganizationLocationObj implements OrganizationLocation {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  state: string;

  @Field()
  city: string;

  @Field()
  street: string;

  @Field()
  number: string;

  @Field({ nullable: true })
  complement?: string;

  @Field()
  postalCode: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
