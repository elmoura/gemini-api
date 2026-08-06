import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { PrintJobDataSource } from '../datasources/print-job.datasource';
import { ListPrintJobsInput } from './types/list-print-jobs.input';
import { ListPrintJobsOutput } from './types/print-job.object';

@Injectable()
export class ListPrintJobsUseCase
  implements IBaseUseCase<ListPrintJobsInput, ListPrintJobsOutput>
{
  constructor(private printJobDataSource: PrintJobDataSource) {}

  async execute(input: ListPrintJobsInput): Promise<ListPrintJobsOutput> {
    const { jobs, totalCount } = await this.printJobDataSource.listByLocation(
      input.organizationId,
      input.locationId,
      {
        status: input.status,
        limit: input.limit ?? 20,
        offset: input.offset ?? 0,
      },
    );

    return { jobs, totalCount };
  }
}
