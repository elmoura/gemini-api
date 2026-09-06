import { Field, ID, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Validate } from 'class-validator';

@InputType()
export class ListCashMovementsInput {
  @Field(() => ID)
  @Validate(IsObjectId)
  cashRegisterId: string;
}
