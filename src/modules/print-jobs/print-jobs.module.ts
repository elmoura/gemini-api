import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import { TableOrdersModule } from '@modules/table-orders/table-orders.module';
import { PrintJob, PrintJobSchema } from './entities/print-job';
import {
  LocationPrintConfig,
  LocationPrintConfigSchema,
} from './entities/location-print-config';
import { PrintJobDataSource } from './datasources/print-job.datasource';
import { LocationPrintConfigDataSource } from './datasources/location-print-config.datasource';
import { PrintJobService } from './services/print-job.service';
import { PrintJobsGateway } from './gateways/print-jobs.gateway';
import { PrintJobsResolver } from './print-jobs.resolver';
import { ListPrintJobsUseCase } from './usecases/list-print-jobs.usecase';
import { AcknowledgePrintJobUseCase } from './usecases/acknowledge-print-job.usecase';
import { GetPrintAgentPresenceUseCase } from './usecases/get-print-agent-presence.usecase';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => TableOrdersModule),
    MongooseModule.forFeature([
      { name: PrintJob.name, schema: PrintJobSchema },
      { name: LocationPrintConfig.name, schema: LocationPrintConfigSchema },
    ]),
  ],
  providers: [
    PrintJobsResolver,
    PrintJobDataSource,
    LocationPrintConfigDataSource,
    PrintJobService,
    PrintJobsGateway,
    ListPrintJobsUseCase,
    AcknowledgePrintJobUseCase,
    GetPrintAgentPresenceUseCase,
  ],
  exports: [PrintJobService],
})
export class PrintJobsModule {}
