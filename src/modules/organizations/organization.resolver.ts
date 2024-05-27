import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { CreateOrganizationInput } from './usecases/types/create-organization.input';
import { OrganizationObj } from './usecases/types/organization.object';
import { OrganizationLocationObj } from './usecases/types/organization-location.object';
import { CreateOrganizationLocationInput } from './usecases/types/create-organization-location.input';
import { CreateOrganizationLocationUseCase } from './usecases/create-organization-location.usecase';
import { GetOrganizationInput } from './usecases/types/get-organization.input';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { GetOrganizationUseCase } from './usecases/get-organization.usecase';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@modules/auth/auth.guard';
import { ListOrganizationLocationsUseCase } from './usecases/list-organization-locations.usecase';
import { ListOrganizationLocationsInput } from './usecases/types/list-organization-locations.input';

@Resolver()
export class OrganizationResolver {
  constructor(
    private getOrganizationUseCase: GetOrganizationUseCase,
    private createOrganizationUseCase: CreateOrganizationUseCase,
    private createOrganizationLocationUseCase: CreateOrganizationLocationUseCase,
    private listOrganizationLocationsUseCase: ListOrganizationLocationsUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => OrganizationObj)
  async getOrganization(
    @Args('input') input: GetOrganizationInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<OrganizationObj> {
    return this.getOrganizationUseCase.execute(input, currentUserData);
  }

  @Mutation(() => OrganizationObj)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
  ): Promise<OrganizationObj> {
    return this.createOrganizationUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => OrganizationLocationObj)
  async createOrganizationLocation(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: CreateOrganizationLocationInput,
  ): Promise<OrganizationLocationObj> {
    return this.createOrganizationLocationUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => [OrganizationLocationObj])
  async listOrganizationLocations(
    @Args('input') input: ListOrganizationLocationsInput,
  ): Promise<OrganizationLocationObj[]> {
    return this.listOrganizationLocationsUseCase.execute(input);
  }
}
