import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { AccountConfirmationInput } from './usecases/dto/account-confirmation.input';
import { AccountConfirmationOutput } from './usecases/dto/account-confirmation.output';
import { CreateUserInvitationInput } from './usecases/dto/create-user-invitation.input';
import { CreateUserInvitationOutput } from './usecases/dto/create-user-invitation.output';

@Resolver()
export class UserResolver {
  constructor(
    private creatUserInvitation: CreateUserInvitationUseCase,
    private accountConfirmationUseCase: AccountConfirmationUseCase,
  ) {}

  @Mutation(() => CreateUserInvitationOutput)
  async createUserInvitation(
    @Args('input') input: CreateUserInvitationInput,
  ): Promise<CreateUserInvitationOutput> {
    return this.creatUserInvitation.execute(input);
  }

  @Mutation(() => AccountConfirmationOutput)
  async confirmAccount(
    @Args('input') input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    return this.accountConfirmationUseCase.execute(input);
  }
}
