import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { TableDataSource } from '../datasources/table.datasource';
import { Table } from '../entities/table';
import { TableNotFoundException } from '../errors/table-not-found';
import { UpdateTableInput } from './types/update-table.input';

@Injectable()
export class UpdateTableUseCase
  implements IBaseUseCase<UpdateTableInput & CurrentUserData, Table>
{
  constructor(
    private readonly tableDataSource: TableDataSource,
    private readonly organizationExistsUseCase: OrganizationExistsUseCase,
    private readonly organizationLocationExistsUseCase: OrganizationLocationExistsUseCase,
  ) {}

  async execute(input: UpdateTableInput & CurrentUserData): Promise<Table> {
    const { tableId, organizationId, locationId, identifier } = input;

    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new ForbiddenException();

    const locationExists = await this.organizationLocationExistsUseCase.execute({
      organizationId,
      locationId,
    });

    if (!locationExists) throw new ForbiddenException();

    const updatedTable = await this.tableDataSource.updateOne(
      tableId,
      organizationId,
      locationId,
      { identifier },
    );

    if (!updatedTable) throw new TableNotFoundException();

    return updatedTable;
  }
}
