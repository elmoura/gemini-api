import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { CreateOrganizationInput } from './usecases/types/create-organization.input';
import { OrganizationObj } from './usecases/types/organization.object';

@Resolver()
export class OrganizationResolver {
  constructor(private createOrganizationUseCase: CreateOrganizationUseCase) {}

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
}
