import { Field, InputType } from '@nestjs/graphql';
import { IsObjectId } from '@shared/validations/is-object-id';
import { IsArray, Validate } from 'class-validator';

@InputType()
export class AddCategoryToMenuInput {
  organizationId: string;

  locationId: string;

  @Field()
  @Validate(IsObjectId)
  menuId: string;

  @IsArray()
  @Validate(IsObjectId, { each: true })
  @Field(() => [String])
  categoryIds: string[];
}
