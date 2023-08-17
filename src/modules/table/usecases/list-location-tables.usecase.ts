import { ForbiddenException, Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { Table } from '../entities/table';
import { CurrentUserData } from '@shared/decorators/current-user';
import { TableDataSource } from '../datasources/table.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationLocationExistsUseCase } from '@modules/organizations/usecases/organization-location-exists.usecase';

@Injectable()
export class ListLocationTablesUseCase
  implements IBaseUseCase<CurrentUserData, Table[]>
{
  constructor(
    private tableDataSource: TableDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
    private organizationLocationExistsUseCase: OrganizationLocationExistsUseCase,
  ) {}

  async execute({
    organizationId,
    locationId,
  }: CurrentUserData): Promise<Table[]> {
    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new ForbiddenException();

    const orgLocationExists =
      await this.organizationLocationExistsUseCase.execute({
        organizationId,
        locationId,
      });

    if (!orgLocationExists) throw new ForbiddenException();

    const tables = await this.tableDataSource.getByOrgAndLocationIds(
      organizationId,
      locationId,
    );

    return tables;
  }
}
