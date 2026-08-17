import { Field, ObjectType } from '@nestjs/graphql';
import { PrintStation } from '../../enums/print-station';

@ObjectType()
export class PrintAgentConnectionObj {
  @Field(() => PrintStation)
  station: PrintStation;

  @Field({ nullable: true })
  sourceDeviceId?: string;
}

@ObjectType()
export class PrintAgentPresenceOutput {
  @Field()
  online: boolean;

  @Field(() => [PrintAgentConnectionObj])
  agents: PrintAgentConnectionObj[];
}
