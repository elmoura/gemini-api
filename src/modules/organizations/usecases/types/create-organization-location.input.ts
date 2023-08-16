import { OrganizationLocation } from '@modules/organizations/entities/organization-location';
import { Field, InputType } from '@nestjs/graphql';
import { IBaseCollection } from '@shared/interfaces/base-collection';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateOrganizationLocationInput
  implements
    Omit<OrganizationLocation, keyof IBaseCollection | keyof IOrganizationData>
{
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @Field()
  @IsString()
  state: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  street: string;

  @Field()
  @IsString()
  number: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  complement?: string;

  @Field()
  @IsString()
  postalCode: string;
}
