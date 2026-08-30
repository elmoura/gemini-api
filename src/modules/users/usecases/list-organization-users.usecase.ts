import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { UserDataSource } from '../datasources/user.datasource';
import { ListOrganizationUsersInput } from './dto/list-organization-users.input';
import { ListOrganizationUsersOutput } from './dto/list-organization-users.output';

type ListOrganizationUsersUseCaseInput = ListOrganizationUsersInput & {
  organizationId: string;
};

@Injectable()
export class ListOrganizationUsersUseCase
  implements
    IBaseUseCase<
      ListOrganizationUsersUseCaseInput,
      ListOrganizationUsersOutput
    >
{
  constructor(private userDataSource: UserDataSource) {}

  async execute({
    organizationId,
    search,
    page = 1,
    limit = 20,
  }: ListOrganizationUsersUseCaseInput): Promise<ListOrganizationUsersOutput> {
    const { data, hasNextPage } =
      await this.userDataSource.findManyByOrganization(organizationId, {
        search,
        page,
        limit,
      });

    return { data, page, limit, hasNextPage };
  }
}
