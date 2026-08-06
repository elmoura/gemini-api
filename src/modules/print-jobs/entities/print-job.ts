import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PrintJobTrigger } from '../enums/print-job-trigger';
import { PrintJobStatus } from '../enums/print-job-status';
import { PrintStation } from '../enums/print-station';
import { PrintClientType } from '../enums/print-client-type';

export type PrintJobDocument = PrintJob & Document;

@Schema({ timestamps: true })
export class PrintJob {
  _id: string;

  @Prop({ required: true })
  organizationId: string;

  @Prop({ required: true })
  locationId: string;

  @Prop({ required: true })
  orderTabId: string;

  @Prop()
  batchId?: string;

  @Prop({ required: true, enum: PrintJobTrigger })
  trigger: PrintJobTrigger;

  @Prop({ required: true, enum: PrintStation })
  targetStation: PrintStation;

  @Prop({ enum: PrintClientType, default: PrintClientType.DESKTOP })
  sourceClientType: PrintClientType;

  @Prop()
  sourceDeviceId?: string;

  @Prop()
  assignedAgentId?: string;

  @Prop({ required: true, enum: PrintJobStatus, default: PrintJobStatus.PENDING })
  status: PrintJobStatus;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  payload: Record<string, unknown>;

  @Prop({ required: true, unique: true })
  idempotencyKey: string;

  @Prop()
  errorMessage?: string;

  @Prop()
  printedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const PrintJobSchema = SchemaFactory.createForClass(PrintJob);

PrintJobSchema.index({ locationId: 1, status: 1 });
PrintJobSchema.index({ organizationId: 1, locationId: 1, createdAt: -1 });
