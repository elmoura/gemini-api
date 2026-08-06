import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PrintJobStatus } from '../../enums/print-job-status';

@InputType()
export class ListPrintJobsInput {
  organizationId: string;

  locationId: string;

  @Field(() => PrintJobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PrintJobStatus)
  status?: PrintJobStatus;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  offset: number;
}
