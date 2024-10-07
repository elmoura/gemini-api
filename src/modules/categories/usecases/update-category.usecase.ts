import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CategoryDataSource } from '../datasources/category.datasource';
import { CategoryObj } from './types/category.object';
import { CategoryProductsValidation } from '../validations/category-products-validation';
import { InvalidProductIdsException } from '../errors/invalid-product-ids.exception';
import { UpdateCategoryInput } from './types/update-category.input';
import { CategoryNotFoundException } from '../errors/category-not-found.exception';
import { RepeatedProductIdsException } from '../errors/repeated-product-ids.exception';
import {
  idArrayToObjectId,
  objectIdArrayToStrings,
} from '@shared/utils/to-object-id';

@Injectable()
export class UpdateCategoryUseCase
  implements IBaseUseCase<UpdateCategoryInput, CategoryObj>
{
  constructor(
    private categoryDataSource: CategoryDataSource,
    private categoryProductsValidation: CategoryProductsValidation,
  ) {}

  async execute(input: UpdateCategoryInput): Promise<CategoryObj> {
    const {
      _id,
      organizationId,
      locationId,
      productsToAdd = [],
      productsToRemove = [],
    } = input;

    const category = await this.categoryDataSource.findById({
      _id,
      organizationId,
      locationId,
    });

    if (!category || category.organizationId !== input.organizationId) {
      throw new CategoryNotFoundException(_id);
    }

    const productIds = [...productsToAdd, ...productsToRemove];
    if (productIds.length > 0) {
      this.validateProductIds(input);

      const { invalidProductIds } =
        await this.categoryProductsValidation.execute({
          organizationId,
          productIds,
        });

      if (invalidProductIds.length > 0) {
        throw new InvalidProductIdsException(invalidProductIds);
      }
    }

    if (productsToAdd.length) {
      await this.categoryDataSource.addProductsToCategory({
        _id,
        productIds: idArrayToObjectId(productsToAdd),
      });
    }

    if (productsToRemove.length) {
      await this.categoryDataSource.removeProductsFromCategory({
        _id,
        productIds: idArrayToObjectId(productsToRemove),
      });
    }

    if (input.name || input.description) {
      await this.categoryDataSource.updateOne(_id, {
        name: input.name,
        description: input.description,
      });
    }

    const updatedCategory = await this.categoryDataSource.findById({
      _id,
      locationId,
    });

    return {
      ...updatedCategory,
      productIds: objectIdArrayToStrings(updatedCategory.productIds),
    };
  }

  private validateProductIds(input: UpdateCategoryInput): void {
    const { productsToAdd = [], productsToRemove = [] } = input;

    const productsToAddSet = new Set(productsToAdd);
    const repeatedProductIds = productsToRemove.filter((item) =>
      productsToAddSet.has(item),
    );

    if (repeatedProductIds.length > 0) {
      throw new RepeatedProductIdsException(repeatedProductIds);
    }
  }
}
