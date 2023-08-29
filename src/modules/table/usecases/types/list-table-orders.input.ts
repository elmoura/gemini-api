import { TableOrderStatuses } from '@modules/table/enums/table-order-statuses';
import { Field, InputType } from '@nestjs/graphql';
import { OrderOptions } from '@shared/interfaces/pagination-options';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class ListTableOrdersInput {
  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  limit?: number;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  offset?: number;

  @IsString()
  @IsOptional()
  @Field(() => TableOrderStatuses, { nullable: true })
  status?: TableOrderStatuses;

  @IsDateString()
  @IsOptional()
  @Field({ nullable: true })
  creationDate?: OrderOptions;
}
