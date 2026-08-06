import { Field, ObjectType } from '@nestjs/graphql';
import { ComplementGroup } from '../../entities/complement-group';
import { ComplementSelectionType } from '../../enums/complement-selection-type';

@ObjectType()
export class ComplementGroupObj implements ComplementGroup {
  @Field()
  _id: string;

  @Field()
  organizationId: string;

  @Field()
  locationId: string;

  @Field()
  name: string;

  @Field()
  minSelections: number;

  @Field()
  maxSelections: number;

  @Field(() => ComplementSelectionType)
  selectionType: ComplementSelectionType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
