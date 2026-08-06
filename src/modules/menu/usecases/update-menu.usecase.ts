import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { MenuDataSource } from '../datasources/menu.datasource';
import { MenuCategoriesValidation } from '../validations/menu-categories.validation';
import { InvalidCategoryIdsException } from '../errors/invalid-category-ids.exeception';
import { MenuNotFoundException } from '../errors/menu-not-found.exception';
import { MenuObj } from './dto/menu.object';
import { UpdateMenuInput } from './dto/update-menu.input';

@Injectable()
export class UpdateMenuUseCase
  implements IBaseUseCase<UpdateMenuInput, MenuObj>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private menuCategoriesValidation: MenuCategoriesValidation,
  ) {}

  async execute(input: UpdateMenuInput): Promise<MenuObj> {
    const { _id, organizationId, locationId } = input;

    const existingMenu = await this.menuDataSource.findById({
      _id,
      organizationId,
      locationId,
    });

    if (!existingMenu) {
      throw new MenuNotFoundException(_id);
    }

    if (input.categoryIds !== undefined) {
      const { invalidCategoryIds } =
        await this.menuCategoriesValidation.execute({
          locationId,
          organizationId,
          categoryIds: input.categoryIds,
        });

      if (invalidCategoryIds.length) {
        throw new InvalidCategoryIdsException(invalidCategoryIds);
      }
    }

    await this.menuDataSource.updateOne(_id, {
      name: input.name,
      description: input.description,
      isActive: input.isActive,
      types: input.types,
      categoryIds: input.categoryIds,
    });

    const updatedMenu = await this.menuDataSource.findById({
      _id,
      organizationId,
      locationId,
    });

    return updatedMenu as unknown as MenuObj;
  }
}
