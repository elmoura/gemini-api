import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationRole } from '../enums/organization-role';
import { UserDataSource } from '../datasources/user.datasource';
import { LastAdminError } from '../errors/last-admin';
import { UserNotFoundError } from '../errors/user-not-found';
import { UpdateUserRolesInput } from './dto/update-user-roles.input';
import { GetUserOutput } from './dto/get-user.output';

type UpdateUserRolesUseCaseInput = UpdateUserRolesInput & {
  organizationId: string;
};

@Injectable()
export class UpdateUserRolesUseCase
  implements IBaseUseCase<UpdateUserRolesUseCaseInput, GetUserOutput>
{
  constructor(private userDataSource: UserDataSource) {}

  async execute({
    userId,
    roles,
    organizationId,
  }: UpdateUserRolesUseCaseInput): Promise<GetUserOutput> {
    const user = await this.userDataSource.findById(userId);

    if (!user || user.organizationId !== organizationId) {
      throw new UserNotFoundError();
    }

    const isRemovingAdmin =
      user.roles.includes(OrganizationRole.ADMIN) &&
      !roles.includes(OrganizationRole.ADMIN);

    if (isRemovingAdmin) {
      const adminCount = await this.userDataSource.countByOrganizationAndRole(
        organizationId,
        OrganizationRole.ADMIN,
      );

      if (adminCount <= 1) {
        throw new LastAdminError();
      }
    }

    const updatedUser = await this.userDataSource.updateRoles(
      userId,
      organizationId,
      roles,
    );

    if (!updatedUser) {
      throw new UserNotFoundError();
    }

    return updatedUser;
  }
}
