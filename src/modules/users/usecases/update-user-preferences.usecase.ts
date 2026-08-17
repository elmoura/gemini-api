import { Injectable } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { UserDataSource } from '@modules/users/datasources/user.datasource';
import { UpdateUserPreferencesInput } from './dto/update-user-preferences.input';
import { UpdateUserPreferencesOutput } from './dto/update-user-preferences.output';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(private userDataSource: UserDataSource) {}

  async execute(
    { themePreference }: UpdateUserPreferencesInput,
    currentUserData: CurrentUserData,
  ): Promise<UpdateUserPreferencesOutput> {
    const user = await this.userDataSource.updateOne(currentUserData.userId, {
      themePreference,
    });

    return { themePreference: user.themePreference };
  }
}
