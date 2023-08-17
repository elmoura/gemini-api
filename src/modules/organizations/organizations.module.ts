import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/entities/user';
import { OrganizationResolver } from './organization.resolver';
import { CreateOrganizationUseCase } from './usecases/create-organization.usecase';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';
import { EmailService } from '@shared/services/email.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UserDataSource } from '@modules/users/datasources/user.datasource';
import { CreateOrganizationLocationUseCase } from './usecases/create-organization-location.usecase';
import { GetOrganizationUseCase } from './usecases/get-organization.usecase';
import { OrganizationEntitiesModule } from './organization-entities.module';

@Module({
  imports: [
    AuthModule,
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
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
    GetOrganizationUseCase,
    CreateUserInvitationUseCase,
    CreateOrganizationUseCase,
    CreateOrganizationLocationUseCase,
  ],
})
export class OrganizationModule {}
