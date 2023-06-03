import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { CreateOrganizationInput } from './usecases/types/create-organization.input';
import { OrganizationObj } from './usecases/types/organization.object';
import { OrganizationLocationObj } from './usecases/types/organization-location.object';
import { CreateOrganizationLocationInput } from './usecases/types/create-organization-location.input';
import { CreateOrganizationLocationUseCase } from './usecases/create-organization-location.usecase';

@Resolver()
export class OrganizationResolver {
  constructor(
    private createOrganizationUseCase: CreateOrganizationUseCase,
    private createOrganizationLocationUseCase: CreateOrganizationLocationUseCase,
  ) {}

  @Query(() => String)
  hello() {
    return 'Hello World';
  }

  @Mutation(() => OrganizationObj)
  async createOrganization(
    @Args('input') input: CreateOrganizationInput,
  ): Promise<OrganizationObj> {
    return this.createOrganizationUseCase.execute(input);
  }

  @Mutation(() => OrganizationLocationObj)
  async createOrgLocation(
    @Args('input') input: CreateOrganizationLocationInput,
  ): Promise<OrganizationLocationObj> {
    return this.createOrganizationLocationUseCase.execute(input);
  }
}
