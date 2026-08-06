import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Validate } from 'class-validator';
import { IsObjectId } from '@shared/validations/is-object-id';

@InputType()
export class ProductComplementGroupInput {
  @Field()
  @Validate(IsObjectId)
  complementGroupId: string;

  @Field()
  @IsString()
  label: string;
}

@ObjectType()
export class ProductComplementGroupObj {
  @Field()
  complementGroupId: string;

  @Field()
  label: string;
}
