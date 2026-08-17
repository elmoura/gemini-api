import { Field, InputType } from '@nestjs/graphql';
import { ThemePreference } from '@modules/users/enums/theme-preference';

@InputType()
export class UpdateUserPreferencesInput {
  @Field(() => ThemePreference)
  themePreference: ThemePreference;
}
