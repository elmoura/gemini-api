import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { MenuObj } from './dto/menu.object';
import { GetLocationMenusInput } from './dto/get-menu.input';
import { MenuDataSource } from '../datasources/menu.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';

@Injectable()
export class GetLocationMenusUseCase
  implements IBaseUseCase<GetLocationMenusInput, MenuObj[]>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute({
    organizationId,
    locationId,
  }: GetLocationMenusInput): Promise<MenuObj[]> {
    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!orgExists) throw new OrganizationNotFoundException();

    const menu = await this.menuDataSource.getByOrganization({
      organizationId,
      locationId,
    });

    return menu as MenuObj[];
  }
}
