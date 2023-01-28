import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { Organization } from '../entities/organization';
import { OrganizationDataSource } from '../datasources/organization.datasource';
import { CreateOrganizationInput } from './types/create-organization.input';
import { CreateUserInvitationUseCase } from '@modules/users/usecases/create-user-invitation.usecase';
import { UserDataSource } from '@modules/users/datasources/user.datasource';
import { UserAlreadyExistsError } from '@modules/users/errors/user-already-exists';

@Injectable()
export class CreateOrganizationUseCase
  implements IBaseUseCase<CreateOrganizationInput, Organization>
{
  constructor(
    private readonly userDataSource: UserDataSource,
    private readonly organizationDataSource: OrganizationDataSource,
    private readonly createUserInvitationUseCase: CreateUserInvitationUseCase,
  ) {}

  async execute(input: CreateOrganizationInput): Promise<Organization> {
    const businessRepresentantExists = await this.userDataSource.findByEmail(
      input.representantEmail,
    );

    if (businessRepresentantExists) {
      throw new UserAlreadyExistsError();
    }

    const organization = await this.organizationDataSource.createOne(input);
    const organizationId = organization._id;

    const businessRepresentantData =
      await this.createUserInvitationUseCase.execute({
        organizationId,
        email: input.representantEmail,
      });

    const businessRepresentantId = businessRepresentantData._id;

    await this.organizationDataSource.updateOne(organizationId, {
      businessRepresentantId,
    });

    return {
      ...organization,
      businessRepresentantId,
    };
  }
}
