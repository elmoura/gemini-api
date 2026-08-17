import { registerEnumType } from '@nestjs/graphql';

export enum ThemePreference {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

registerEnumType(ThemePreference, { name: 'ThemePreference' });
