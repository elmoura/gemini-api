import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateMenuInput } from './dto/create-menu.input';
import { MenuObj } from './dto/menu.object';
import { MenuDataSource } from '../datasources/menu.datasource';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { MenuCategoriesValidation } from '../validations/menu-categories.validation';
import { InvalidCategoryIdsException } from '../errors/invalid-category-ids.exeception';

@Injectable()
export class CreateMenuUseCase
  implements IBaseUseCase<CreateMenuInput, MenuObj>
{
  constructor(
    private menuDataSource: MenuDataSource,
    private organizationDataSource: OrganizationDataSource,
    private menuCategoriesValidation: MenuCategoriesValidation,
  ) {}

  async execute(input: CreateMenuInput): Promise<MenuObj> {
    const organization = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organization) {
      throw new OrganizationNotFoundException();
    }

    if (input.categoryIds) {
      const { invalidCategoryIds } =
        await this.menuCategoriesValidation.execute({
          locationId: input.locationId,
          organizationId: input.organizationId,
          categoryIds: input.categoryIds,
        });

      if (invalidCategoryIds.length) {
        throw new InvalidCategoryIdsException(invalidCategoryIds);
      }
    }

    const createdMenu = await this.menuDataSource.create({
      ...input,
      isActive: input.isActive || true,
      categoryIds: input.categoryIds || [],
    });

    const result = (await this.menuDataSource.findById({
      _id: createdMenu._id,
      locationId: input.locationId,
      organizationId: input.organizationId,
    })) as unknown as MenuObj;

    return result;
  }
}
