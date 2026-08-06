import { Field, InputType } from '@nestjs/graphql';
import { IsString, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class UpdateTableInput {
  @Field()
  @Validate(IsObjectId)
  tableId: string;

  @Field()
  @IsString()
  identifier: string;
}
