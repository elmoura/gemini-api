import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsIn, IsOptional, IsString, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';
import { PrintJobStatus } from '../../enums/print-job-status';

@InputType()
export class AcknowledgePrintJobInput {
  organizationId: string;

  @Field()
  @Validate(IsObjectId)
  jobId: string;

  @Field(() => PrintJobStatus)
  @IsIn([PrintJobStatus.PRINTED, PrintJobStatus.FAILED])
  status: PrintJobStatus.PRINTED | PrintJobStatus.FAILED;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedAgentId?: string;
}
