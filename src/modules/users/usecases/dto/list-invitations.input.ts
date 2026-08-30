import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { InvitationStatus } from '../../entities/invitation';

@InputType()
export class ListInvitationsInput {
  @Field(() => InvitationStatus, { nullable: true })
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;
}
