import { renderFile } from 'pug';
import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { EmailService } from '@shared/services/email.service';
import { UserDataSource } from '../datasources/user.datasource';
import { CreateUserInvitationInput } from './dto/create-user-invitation.input';
import { CreateUserInvitationOutput } from './dto/create-user-invitation.output';
import { join } from 'path';

@Injectable()
export class CreateUserInvitationUseCase
  implements
    IBaseUseCase<CreateUserInvitationInput, CreateUserInvitationOutput>
{
  private readonly invitationTemplatePath: string;

  constructor(
    private emailService: EmailService,
    private userDataSource: UserDataSource,
  ) {
    this.invitationTemplatePath = join(
      process.cwd(),
      'src',
      'shared',
      'templates',
      'user-invitation.pug',
    );
  }

  async execute(
    input: CreateUserInvitationInput,
  ): Promise<CreateUserInvitationOutput> {
    const { email } = input;
    const userExists = await this.userDataSource.findByEmail(email);

    if (userExists) {
      throw new Error('user already exists.');
    }

    const userInvitation = await this.userDataSource.createInvitationInstance(
      input,
    );

    await this.emailService.sendMail({
      to: email,
      subject: 'Você foi convidado para o Chefin!',
      html: renderFile(this.invitationTemplatePath),
    });

    return userInvitation;
  }
}
