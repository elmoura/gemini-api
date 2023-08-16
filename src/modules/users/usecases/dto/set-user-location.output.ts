import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SetUserLocationOutput {
  @Field()
  newAccessToken: string;
}
