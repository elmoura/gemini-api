import { Field, InputType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class CreateTableOrderInput {
  @Field()
  @Validate(IsObjectId)
  tableId: string;
}
