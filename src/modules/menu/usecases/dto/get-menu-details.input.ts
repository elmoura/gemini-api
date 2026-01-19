import { Field, InputType } from '@nestjs/graphql';
import { IsString, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class GetMenuDetailsInput {
  @Field()
  @IsString()
  @Validate(IsObjectId)
  menuId: string;
}
