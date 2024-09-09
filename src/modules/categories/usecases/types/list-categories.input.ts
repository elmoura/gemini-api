import { Field, InputType } from '@nestjs/graphql';
import { IOrganizationData } from '@shared/interfaces/organization-data';
import { IPaginationOptions } from '@shared/interfaces/pagination-options';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class ListCategoriesInput
  implements Partial<IPaginationOptions & IOrganizationData>
{
  organizationId: string;

  locationId: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  offset?: number;
}
