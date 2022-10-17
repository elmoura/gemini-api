import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UserDataSource } from '../datasources/user.datasource';
import { CreateUserInvitationInput } from './dto/create-user-invitation.input';
import { CreateUserInvitationOutput } from './dto/create-user-invitation.output';

@Injectable()
export class CreateUserInvitationUseCase
  implements
    IBaseUseCase<CreateUserInvitationInput, CreateUserInvitationOutput>
{
  constructor(private userDataSource: UserDataSource) {}

  async execute(
    input: CreateUserInvitationInput,
  ): Promise<CreateUserInvitationOutput> {
    const userInvitation = await this.userDataSource.createInvitationInstance(
      input,
    );

    // enviar e-mail com link pra terminar o cadastro

    return userInvitation;
  }
}
