import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CustomerObj } from './usecases/dtos/customer.object';
import { CreateCustomerInput } from './usecases/dtos/create-customer.input';
import { CreateCustomerUseCase } from './usecases/create-customer.usecase';

@Resolver()
export class CustomerResolver {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  @Mutation(() => CustomerObj)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
  ): Promise<CustomerObj> {
    return this.createCustomerUseCase.execute(input);
  }
}
