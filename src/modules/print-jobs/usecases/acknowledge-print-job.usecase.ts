import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { PrintJobDataSource } from '../datasources/print-job.datasource';
import { AcknowledgePrintJobInput } from './types/acknowledge-print-job.input';
import { PrintJobObj } from './types/print-job.object';
import { PrintJobNotFoundException } from '../errors/print-job-not-found';
import { PrintJobStatus } from '../enums/print-job-status';

@Injectable()
export class AcknowledgePrintJobUseCase
  implements IBaseUseCase<AcknowledgePrintJobInput, PrintJobObj>
{
  constructor(private printJobDataSource: PrintJobDataSource) {}

  async execute(input: AcknowledgePrintJobInput): Promise<PrintJobObj> {
    const existing = await this.printJobDataSource.findById(
      input.jobId,
      input.organizationId,
    );

    if (!existing) throw new PrintJobNotFoundException();

    const updated = await this.printJobDataSource.updateStatus(
      input.jobId,
      input.organizationId,
      {
        status: input.status,
        errorMessage: input.errorMessage,
        printedAt:
          input.status === PrintJobStatus.PRINTED ? new Date() : undefined,
        assignedAgentId: input.assignedAgentId,
      },
    );

    if (!updated) throw new PrintJobNotFoundException();

    return updated;
  }
}
