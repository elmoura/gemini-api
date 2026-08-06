import { ForbiddenException, Injectable } from '@nestjs/common';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';
import { CurrentUserData } from '@shared/decorators/current-user';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { TableDataSource } from '../datasources/table.datasource';
import { Table } from '../entities/table';
import { TableNotFoundException } from '../errors/table-not-found';
import { DeleteTableInput } from './types/delete-table.input';

@Injectable()
export class DeleteTableUseCase
  implements IBaseUseCase<DeleteTableInput & CurrentUserData, Table>
{
  constructor(
    private readonly tableDataSource: TableDataSource,
    private readonly organizationExistsUseCase: OrganizationExistsUseCase,
    private readonly organizationLocationExistsUseCase: OrganizationLocationExistsUseCase,
  ) {}

  async execute(input: DeleteTableInput & CurrentUserData): Promise<Table> {
    const { tableId, organizationId, locationId } = input;

    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new ForbiddenException();

    const locationExists = await this.organizationLocationExistsUseCase.execute({
      organizationId,
      locationId,
    });

    if (!locationExists) throw new ForbiddenException();

    const deletedTable = await this.tableDataSource.deleteOne(
      tableId,
      organizationId,
      locationId,
    );

    if (!deletedTable) throw new TableNotFoundException();

    return deletedTable;
  }
}
