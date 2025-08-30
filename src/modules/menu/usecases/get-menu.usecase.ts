import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { GetLocationMenusInput } from './dto/get-menu.input';
import { MenuDataSource } from '../datasources/menu.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { MenuWithCategoriesObj } from './dto/menu-with-categories.object';

@Injectable()
export class GetLocationMenusUseCase
  implements IBaseUseCase<GetLocationMenusInput, MenuWithCategoriesObj[]>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute({
    organizationId,
    locationId,
  }: GetLocationMenusInput): Promise<MenuWithCategoriesObj[]> {
    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!orgExists) throw new OrganizationNotFoundException();

    const menu = await this.menuDataSource.getByOrganization({
      organizationId,
      locationId,
    });

    return menu as unknown as MenuWithCategoriesObj[];
  }
}
