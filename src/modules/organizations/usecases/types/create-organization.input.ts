import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field()
  representantEmail: string;

  @Field()
  businessSegment: string;

  locations?: any[];
}
