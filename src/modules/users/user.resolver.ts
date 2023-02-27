import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { AccountConfirmationInput } from './usecases/dto/account-confirmation.input';
import { AccountConfirmationOutput } from './usecases/dto/account-confirmation.output';
import { CreateUserInvitationInput } from './usecases/dto/create-user-invitation.input';
import { CreateUserInvitationOutput } from './usecases/dto/create-user-invitation.output';
import { LoginUserInput } from './usecases/dto/login-user.input';
import { LoginUserOutput } from './usecases/dto/login-user.output';
import { LoginUserUseCase } from './usecases/login-user.usecase';

@Resolver()
export class UserResolver {
  constructor(
    private loginUserUseCase: LoginUserUseCase,
    private creatUserInvitationUseCase: CreateUserInvitationUseCase,
    private accountConfirmationUseCase: AccountConfirmationUseCase,
  ) {}

  @Mutation(() => CreateUserInvitationOutput)
  async createUserInvitation(
    @Args('input') input: CreateUserInvitationInput,
  ): Promise<CreateUserInvitationOutput> {
    return this.creatUserInvitationUseCase.execute(input);
  }

  @Mutation(() => AccountConfirmationOutput)
  async confirmAccount(
    @Args('input') input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    return this.accountConfirmationUseCase.execute(input);
  }

  @Mutation(() => LoginUserOutput)
  async login(@Args('input') input: LoginUserInput): Promise<LoginUserOutput> {
    return this.loginUserUseCase.execute(input);
  }
}
