import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { AccountConfirmationInput } from './usecases/dto/account-confirmation.input';
import { AccountConfirmationOutput } from './usecases/dto/account-confirmation.output';
import { CreateUserInvitationInput } from './usecases/dto/create-user-invitation.input';
import { CreateUserInvitationOutput } from './usecases/dto/create-user-invitation.output';
import { LoginUserInput } from './usecases/dto/login-user.input';
import { LoginUserOutput } from './usecases/dto/login-user.output';
import { LoginUserUseCase } from './usecases/login-user.usecase';
import { GetUserOutput } from './usecases/dto/get-user.output';
import { GetUserUseCase } from './usecases/get-user.usecase';
import { SetUserLocationOutput } from './usecases/dto/set-user-location.output';
import { SetUserLocationInput } from './usecases/dto/set-user-location.input';
import { SetUserLocationUseCase } from './usecases/set-user-location.usecase';

@Resolver()
export class UserResolver {
  constructor(
    private getUserUseCase: GetUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private setUserLocationUseCase: SetUserLocationUseCase,
    private creatUserInvitationUseCase: CreateUserInvitationUseCase,
    private accountConfirmationUseCase: AccountConfirmationUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateUserInvitationOutput)
  async createUserInvitation(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: CreateUserInvitationInput,
  ): Promise<CreateUserInvitationOutput> {
    return this.creatUserInvitationUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @Mutation(() => AccountConfirmationOutput)
  async confirmAccount(
    @Args('input') input: AccountConfirmationInput,
  ): Promise<AccountConfirmationOutput> {
    return this.accountConfirmationUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => SetUserLocationOutput)
  async setUserLocation(
    @Args('input') input: SetUserLocationInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<SetUserLocationOutput> {
    return this.setUserLocationUseCase.execute(input, currentUserData);
  }

  @Mutation(() => LoginUserOutput)
  async login(@Args('input') input: LoginUserInput): Promise<LoginUserOutput> {
    return this.loginUserUseCase.execute(input);
  }

  @UseGuards(AuthGuard)
  @Query(() => GetUserOutput)
  async me(@CurrentUser() user: CurrentUserData): Promise<GetUserOutput> {
    const { userId } = user;
    return this.getUserUseCase.execute({ userId });
  }
}
