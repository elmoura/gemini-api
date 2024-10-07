import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { CategoryDataSource } from '../datasources/category.datasource';
import { CreateCategoryInput } from './types/create-category.input';
import { CategoryObj } from './types/category.object';
import { CategoryProductsValidation } from '../validations/category-products-validation';
import { InvalidProductIdsException } from '../errors/invalid-product-ids.exception';
import { LocationNotSetException } from '@shared/errors/location-not-set.exception';
import {
  idArrayToObjectId,
  objectIdArrayToStrings,
} from '@shared/utils/to-object-id';

@Injectable()
export class CreateCategoryUseCase
  implements IBaseUseCase<CreateCategoryInput, CategoryObj>
{
  constructor(
    private categoryDataSource: CategoryDataSource,
    private organizationDataSource: OrganizationDataSource,
    private categoryProductsValidation: CategoryProductsValidation,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CategoryObj> {
    if (!input.locationId) {
      throw new LocationNotSetException();
    }

    const organizationExists = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    if (input.productIds?.length > 0) {
      const { invalidProductIds } =
        await this.categoryProductsValidation.execute({
          organizationId: input.organizationId,
          productIds: input.productIds,
        });

      if (invalidProductIds.length > 0) {
        throw new InvalidProductIdsException(invalidProductIds);
      }
    }

    const productIds = input.productIds
      ? idArrayToObjectId(input.productIds)
      : [];

    const category = await this.categoryDataSource.createOne({
      ...input,
      productIds,
    });

    return {
      ...category,
      productIds: objectIdArrayToStrings(category.productIds),
    };
  }
}
