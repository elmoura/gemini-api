import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { AccountConfirmationInput } from './usecases/dto/account-confirmation.input';
import { AccountConfirmationOutput } from './usecases/dto/account-confirmation.output';

@Resolver()
export class UserResolver {
  constructor(private accountConfirmationUseCase: AccountConfirmationUseCase) {}

  @Mutation(() => AccountConfirmationOutput)
  async confirmAccount(
    @Args('input') input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    return this.accountConfirmationUseCase.execute(input);
  }
}
