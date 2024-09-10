import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { Injectable } from '@nestjs/common';

type Params = {
  locationId: string;
  organizationId: string;
  categoryIds: string[];
};

type Result = {
  invalidCategoryIds: string[];
};

@Injectable()
export class MenuCategoriesValidation {
  constructor(private categoryDataSource: CategoryDataSource) {}

  async execute({
    organizationId,
    locationId,
    categoryIds,
  }: Params): Promise<Result> {
    const invalidCategoryIds = [];

    await Promise.all(
      categoryIds.map(async (categoryId) => {
        const category = await this.categoryDataSource.findById({
          _id: categoryId,
          organizationId,
          locationId,
        });

        if (
          !category ||
          category.organizationId !== organizationId ||
          category.locationId !== locationId
        ) {
          invalidCategoryIds.push(categoryId);
        }
      }),
    );

    return { invalidCategoryIds };
  }
}
