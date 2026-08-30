import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GetUserOutput } from './get-user.output';

@ObjectType()
export class ListOrganizationUsersOutput {
  @Field(() => [GetUserOutput])
  data: GetUserOutput[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasNextPage: boolean;
}
