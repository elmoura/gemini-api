import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional } from 'class-validator';

@InputType()
export class ListCashRegistersInput {
  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  limit?: number;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  offset?: number;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  startedAtFrom?: Date;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  startedAtTo?: Date;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  finishedAtFrom?: Date;

  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  finishedAtTo?: Date;
}
