import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { Validate } from 'class-validator';

@InputType()
export class FindComplementInput {
  organizationId: string;
  locationId: string;

  @Field()
  @Validate(IsObjectId)
  _id: string;
}

@InputType()
export class ListComplementsInput {
  organizationId: string;
  locationId: string;

  @Field()
  @Validate(IsObjectId)
  complementGroupId: string;
}
