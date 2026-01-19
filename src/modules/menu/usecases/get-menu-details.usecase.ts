import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { MenuDataSource } from '../datasources/menu.datasource';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { GetMenuDetailsInput } from './dto/get-menu-details.input';
import { MenuDetailsObj } from './dto/menu-details.object';
import { CategoryObj } from '@modules/categories/usecases/types/category.object';
import { MenuNotFoundException } from '../errors/menu-not-found.exception';

type GetMenuDetailsParams = GetMenuDetailsInput & {
  organizationId: string;
  locationId: string;
};

@Injectable()
export class GetMenuDetailsUseCase
  implements IBaseUseCase<GetMenuDetailsParams, MenuDetailsObj>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private categoryDataSource: CategoryDataSource,
  ) {}

  async execute(params: GetMenuDetailsParams): Promise<MenuDetailsObj> {
    const { menuId, organizationId, locationId } = params;

    const menu = await this.menuDataSource.findById(
      { _id: menuId, organizationId, locationId },
      { showCategories: true, showProducts: false },
    );

    if (!menu) {
      throw new MenuNotFoundException(menuId);
    }

    const categories = await this.categoryDataSource.findByIds({
      _id: menu.categoryIds,
      organizationId,
      locationId,
    });

    return {
      ...menu,
      categoryIds: menu.categoryIds,
      categories: categories as unknown as CategoryObj[],
    };
  }
}
