import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { MenuObj } from './dto/menu.object';
import { MenuDataSource } from '../datasources/menu.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { AddCategoryToMenuInput } from './dto/add-category-to-menu.input';
import { MenuNotFoundException } from '../errors/menu-not-found.exception';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { InvalidCategoryIdsException } from '../errors/invalid-category-ids.exeception';
import { Category } from '@modules/categories/entities/category';

@Injectable()
export class AddCategoryToMenuUseCase
  implements IBaseUseCase<AddCategoryToMenuInput, MenuObj>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
    private categoryDataSource: CategoryDataSource,
  ) {}

  async execute({
    organizationId,
    locationId,
    menuId,
    categoryIds,
  }: AddCategoryToMenuInput): Promise<MenuObj> {
    const orgExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!orgExists) throw new OrganizationNotFoundException();

    const menu = await this.menuDataSource.findById({
      organizationId,
      _id: menuId,
      locationId,
    });

    if (!menu) throw new MenuNotFoundException(menuId);

    const categories = await this.categoryDataSource.findByIds({
      locationId,
      organizationId,
      _id: categoryIds,
    });

    if (categories.length !== categoryIds.length) {
      const invalidCategoryIds = this.getInvalidCategoryIds(
        categoryIds,
        categories,
      );

      throw new InvalidCategoryIdsException(invalidCategoryIds);
    }

    const updateResult = await this.menuDataSource.insertCategoryIds(
      menuId,
      categoryIds,
    );

    return updateResult;
  }

  private getInvalidCategoryIds(
    categoryIds: string[],
    categories: Category[],
  ): string[] {
    return categoryIds.filter(
      (categoryId) =>
        !categories.some((category) => category._id === categoryId),
    );
  }
}
