import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
} from 'class-validator';
import { CashMovementType } from '../../entities/cash-movement';

@InputType()
export class RegisterCashMovementInput {
  @Field(() => CashMovementType)
  @IsEnum(CashMovementType)
  type: CashMovementType;

  @Field()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  reason?: string;
}
