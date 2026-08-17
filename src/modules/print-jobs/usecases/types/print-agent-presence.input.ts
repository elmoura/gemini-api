import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PrintStation } from '../../enums/print-station';

@InputType()
export class PrintAgentPresenceInput {
  organizationId: string;

  locationId: string;

  @Field(() => PrintStation, { nullable: true })
  @IsOptional()
  @IsEnum(PrintStation)
  station?: PrintStation;
}
