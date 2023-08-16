import { ForbiddenException, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateTableInput } from './types/create-table.input';
import { TableDataSource } from '../datasources/table.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';
import { Table } from '../entities/table';

@Injectable()
export class CreateTableUseCase
  implements IBaseUseCase<CreateTableInput, Table>
{
  constructor(
    private readonly tableDataSource: TableDataSource,
    private readonly organizationExistsUseCase: OrganizationExistsUseCase,
    private readonly organizationLocationExistsUseCase: OrganizationLocationExistsUseCase,
  ) {}

  async execute(input: CreateTableInput): Promise<Table> {
    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId: input.organizationId,
    });

    if (!orgExists) {
      throw new ForbiddenException();
    }

    const locationExists = await this.organizationLocationExistsUseCase.execute(
      { locationId: input.locationId },
    );

    if (!locationExists) {
      throw new ForbiddenException();
    }

    const table = await this.tableDataSource.createOne(input);

    return table;
  }
}
