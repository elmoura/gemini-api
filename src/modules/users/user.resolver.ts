import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CurrentUser, CurrentUserData } from '@shared/decorators/current-user';
import { Roles } from '@shared/decorators/roles.decorator';
import { RolesGuard } from '@shared/guards/roles.guard';
import { OrganizationRole } from './enums/organization-role';
import { AccountConfirmationUseCase } from './usecases/account-confirmation.usecase';
import { CreateUserInvitationUseCase } from './usecases/create-user-invitation.usecase';
import { ResendInvitationUseCase } from './usecases/resend-invitation.usecase';
import { CancelInvitationUseCase } from './usecases/cancel-invitation.usecase';
import { ListInvitationsUseCase } from './usecases/list-invitations.usecase';
import { AccountConfirmationInput } from './usecases/dto/account-confirmation.input';
import { AccountConfirmationOutput } from './usecases/dto/account-confirmation.output';
import { CreateUserInvitationInput } from './usecases/dto/create-user-invitation.input';
import { ResendInvitationInput } from './usecases/dto/resend-invitation.input';
import { CancelInvitationInput } from './usecases/dto/cancel-invitation.input';
import { ListInvitationsInput } from './usecases/dto/list-invitations.input';
import { InvitationObject } from './usecases/dto/invitation.object';
import { LoginUserInput } from './usecases/dto/login-user.input';
import { LoginUserOutput } from './usecases/dto/login-user.output';
import { LoginUserUseCase } from './usecases/login-user.usecase';
import { GetUserOutput } from './usecases/dto/get-user.output';
import { GetUserUseCase } from './usecases/get-user.usecase';
import { SetUserLocationOutput } from './usecases/dto/set-user-location.output';
import { SetUserLocationInput } from './usecases/dto/set-user-location.input';
import { SetUserLocationUseCase } from './usecases/set-user-location.usecase';
import { UpdateUserPreferencesOutput } from './usecases/dto/update-user-preferences.output';
import { UpdateUserPreferencesInput } from './usecases/dto/update-user-preferences.input';
import { UpdateUserPreferencesUseCase } from './usecases/update-user-preferences.usecase';
import { ListOrganizationUsersInput } from './usecases/dto/list-organization-users.input';
import { ListOrganizationUsersOutput } from './usecases/dto/list-organization-users.output';
import { ListOrganizationUsersUseCase } from './usecases/list-organization-users.usecase';
import { UpdateUserRolesInput } from './usecases/dto/update-user-roles.input';
import { UpdateUserRolesUseCase } from './usecases/update-user-roles.usecase';

@Resolver()
export class UserResolver {
  constructor(
    private getUserUseCase: GetUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
    private setUserLocationUseCase: SetUserLocationUseCase,
    private creatUserInvitationUseCase: CreateUserInvitationUseCase,
    private resendInvitationUseCase: ResendInvitationUseCase,
    private cancelInvitationUseCase: CancelInvitationUseCase,
    private listInvitationsUseCase: ListInvitationsUseCase,
    private accountConfirmationUseCase: AccountConfirmationUseCase,
    private updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
    private listOrganizationUsersUseCase: ListOrganizationUsersUseCase,
    private updateUserRolesUseCase: UpdateUserRolesUseCase,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Mutation(() => InvitationObject)
  async createUserInvitation(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: CreateUserInvitationInput,
  ): Promise<InvitationObject> {
    return this.creatUserInvitationUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
      invitedByUserId: currentUserData.userId,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Mutation(() => InvitationObject)
  async resendInvitation(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: ResendInvitationInput,
  ): Promise<InvitationObject> {
    return this.resendInvitationUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Mutation(() => InvitationObject)
  async cancelInvitation(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: CancelInvitationInput,
  ): Promise<InvitationObject> {
    return this.cancelInvitationUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Query(() => [InvitationObject])
  async listInvitations(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: ListInvitationsInput,
  ): Promise<InvitationObject[]> {
    return this.listInvitationsUseCase.execute({
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

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateUserPreferencesOutput)
  async updateUserPreferences(
    @Args('input') input: UpdateUserPreferencesInput,
    @CurrentUser() currentUserData: CurrentUserData,
  ): Promise<UpdateUserPreferencesOutput> {
    return this.updateUserPreferencesUseCase.execute(input, currentUserData);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Query(() => ListOrganizationUsersOutput)
  async listOrganizationUsers(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: ListOrganizationUsersInput,
  ): Promise<ListOrganizationUsersOutput> {
    return this.listOrganizationUsersUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(OrganizationRole.ADMIN)
  @Mutation(() => GetUserOutput)
  async updateUserRoles(
    @CurrentUser() currentUserData: CurrentUserData,
    @Args('input') input: UpdateUserRolesInput,
  ): Promise<GetUserOutput> {
    return this.updateUserRolesUseCase.execute({
      ...input,
      organizationId: currentUserData.organizationId,
    });
  }
}
