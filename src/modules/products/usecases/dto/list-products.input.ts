import { Field, InputType } from '@nestjs/graphql';
import { IPaginationOptions } from '@shared/interfaces/pagination-options';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class ListProductsInput implements Partial<IPaginationOptions> {
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
