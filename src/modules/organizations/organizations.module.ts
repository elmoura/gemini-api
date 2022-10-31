import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import { Organization, OrganizationSchema } from './entities/organization';
import { OrganizationResolver } from './organization.resolver';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { OrganizationDataSource } from './datasources/organization.datasource';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { UserDataSource } from '@modules/users/datasources/user.datasource';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    EmailService,
    UserDataSource,
    OrganizationResolver,
    OrganizationDataSource,
    CreateUserInvitationUseCase,
    CreateOrganizationUseCase,
  ],
})
export class OrganizationModule {}
