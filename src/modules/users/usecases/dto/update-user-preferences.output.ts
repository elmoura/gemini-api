import { Field, ObjectType } from '@nestjs/graphql';
import { ThemePreference } from '@modules/users/enums/theme-preference';

@ObjectType()
export class UpdateUserPreferencesOutput {
  @Field(() => ThemePreference)
  themePreference: ThemePreference;
}
