import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { PrintJobsGateway } from '../gateways/print-jobs.gateway';
import { PrintAgentPresenceInput } from './types/print-agent-presence.input';
import { PrintAgentPresenceOutput } from './types/print-agent-presence.object';

@Injectable()
export class GetPrintAgentPresenceUseCase
  implements IBaseUseCase<PrintAgentPresenceInput, PrintAgentPresenceOutput>
{
  constructor(private printJobsGateway: PrintJobsGateway) {}

  async execute(
    input: PrintAgentPresenceInput,
  ): Promise<PrintAgentPresenceOutput> {
    const agents = await this.printJobsGateway.listConnectedAgents(
      input.locationId,
      input.station,
    );

    return { online: agents.length > 0, agents };
  }
}
