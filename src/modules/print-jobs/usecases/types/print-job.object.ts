import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PrintJob } from '../../entities/print-job';
import { PrintJobTrigger } from '../../enums/print-job-trigger';
import { PrintJobStatus } from '../../enums/print-job-status';
import { PrintStation } from '../../enums/print-station';
import { PrintClientType } from '../../enums/print-client-type';

registerEnumType(PrintJobTrigger, { name: 'PrintJobTrigger' });
registerEnumType(PrintJobStatus, { name: 'PrintJobStatus' });
registerEnumType(PrintStation, { name: 'PrintStation' });
registerEnumType(PrintClientType, { name: 'PrintClientType' });

@ObjectType()
export class PrintJobObj implements PrintJob {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  orderTabId: string;

  @Field({ nullable: true })
  batchId?: string;

  @Field(() => PrintJobTrigger)
  trigger: PrintJobTrigger;

  @Field(() => PrintStation)
  targetStation: PrintStation;

  @Field(() => PrintClientType)
  sourceClientType: PrintClientType;

  @Field({ nullable: true })
  sourceDeviceId?: string;

  @Field({ nullable: true })
  assignedAgentId?: string;

  @Field(() => PrintJobStatus)
  status: PrintJobStatus;

  @Field(() => GraphQLJSON)
  payload: Record<string, unknown>;

  @Field()
  idempotencyKey: string;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  printedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ListPrintJobsOutput {
  @Field(() => [PrintJobObj])
  jobs: PrintJobObj[];

  @Field()
  totalCount: number;
}
