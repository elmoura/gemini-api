import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { MenuObj } from './dto/menu.object';
import { GetMenuInput } from './dto/get-menu.input';
import { MenuDataSource } from '../datasources/menu.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';

@Injectable()
export class GetMenuUseCase implements IBaseUseCase<GetMenuInput, MenuObj> {
  constructor(
    private menuDataSource: MenuDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute({ organizationId }: GetMenuInput): Promise<MenuObj> {
    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!orgExists) throw new OrganizationNotFoundException();

    const categories = await this.menuDataSource.getByOrganization(
      organizationId,
    );

    console.log(categories);

    return {
      categories,
    };
  }
}
