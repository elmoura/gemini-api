import { Injectable } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { SetUserLocationOutput } from './dto/set-user-location.output';
import { TokenService } from '@modules/auth/services/token.service';
import { SetUserLocationInput } from './dto/set-user-location.input';
import { OrganizationLocationDataSource } from '@modules/organizations/datasources/organization-location.datasource';
import { UserLocationDontExistException } from '../errors/user-location-dont-exist';

@Injectable()
export class SetUserLocationUseCase {
  constructor(
    private tokenService: TokenService,
    private organizationLocationDataSource: OrganizationLocationDataSource,
  ) {}

  async execute(
    { locationId }: SetUserLocationInput,
    currentUserData: CurrentUserData,
  ): Promise<SetUserLocationOutput> {
    const locationExists =
      await this.organizationLocationDataSource.findOrgLocationByIds(
        currentUserData.organizationId,
        locationId,
      );

    if (!locationExists) throw new UserLocationDontExistException();

    const { accessToken } = this.tokenService.generate({
      locationId,
      userId: currentUserData.userId,
      organizationId: currentUserData.organizationId,
    });

    return { newAccessToken: accessToken };
  }
}
