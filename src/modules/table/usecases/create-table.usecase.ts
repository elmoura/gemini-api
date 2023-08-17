import { ForbiddenException, Injectable } from '@nestjs/common';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';
import { Table } from '../entities/table';
import { CreateTableInput } from './types/create-table.input';
import { TableDataSource } from '../datasources/table.datasource';

@Injectable()
export class CreateTableUseCase
  implements IBaseUseCase<CreateTableInput & CurrentUserData, Table>
{
  constructor(
    private readonly tableDataSource: TableDataSource,
    private readonly organizationExistsUseCase: OrganizationExistsUseCase,
    private readonly organizationLocationExistsUseCase: OrganizationLocationExistsUseCase,
  ) {}

  async execute(input: CreateTableInput & CurrentUserData): Promise<Table> {
    const { organizationId, locationId } = input;

    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!orgExists) {
      throw new ForbiddenException();
    }

    const locationExists = await this.organizationLocationExistsUseCase.execute(
      { organizationId, locationId },
    );

    if (!locationExists) {
      throw new ForbiddenException();
    }

    const table = await this.tableDataSource.createOne(input);

    return table;
  }
}
