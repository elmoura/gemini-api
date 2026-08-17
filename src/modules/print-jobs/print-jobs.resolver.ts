import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { ListPrintJobsUseCase } from './usecases/list-print-jobs.usecase';
import { AcknowledgePrintJobUseCase } from './usecases/acknowledge-print-job.usecase';
import { GetPrintAgentPresenceUseCase } from './usecases/get-print-agent-presence.usecase';
import { ListPrintJobsInput } from './usecases/types/list-print-jobs.input';
import { AcknowledgePrintJobInput } from './usecases/types/acknowledge-print-job.input';
import {
  ListPrintJobsOutput,
  PrintJobObj,
} from './usecases/types/print-job.object';
import { PrintAgentPresenceInput } from './usecases/types/print-agent-presence.input';
import { PrintAgentPresenceOutput } from './usecases/types/print-agent-presence.object';

@Resolver()
@UseGuards(AuthGuard)
export class PrintJobsResolver {
  constructor(
    private listPrintJobsUseCase: ListPrintJobsUseCase,
    private acknowledgePrintJobUseCase: AcknowledgePrintJobUseCase,
    private getPrintAgentPresenceUseCase: GetPrintAgentPresenceUseCase,
  ) {}

  @Query(() => ListPrintJobsOutput)
  listPrintJobs(
    @Args('input') input: ListPrintJobsInput,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ListPrintJobsOutput> {
    return this.listPrintJobsUseCase.execute({
      ...input,
      organizationId: currentUser.organizationId,
      locationId: currentUser.locationId,
    });
  }

  @Mutation(() => PrintJobObj)
  acknowledgePrintJob(
    @Args('input') input: AcknowledgePrintJobInput,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PrintJobObj> {
    return this.acknowledgePrintJobUseCase.execute({
      ...input,
      organizationId: currentUser.organizationId,
    });
  }

  @Query(() => PrintAgentPresenceOutput)
  printAgentPresence(
    @Args('input') input: PrintAgentPresenceInput,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PrintAgentPresenceOutput> {
    return this.getPrintAgentPresenceUseCase.execute({
      ...input,
      organizationId: currentUser.organizationId,
      locationId: currentUser.locationId,
    });
  }
}
