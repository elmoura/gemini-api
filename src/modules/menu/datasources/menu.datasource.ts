import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '@modules/categories/entities/category';
import { Product } from '@modules/products/entities/product';

interface CategoryWithProducts extends Category {
  products: Product[];
}

interface IMenuDataSource {
  getByOrganization(organizationId: string): Promise<CategoryWithProducts[]>;
}

@Injectable()
export class MenuDataSource implements IMenuDataSource {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async getByOrganization(
    organizationId: string,
  ): Promise<CategoryWithProducts[]> {
    const result = await this.categoryModel.aggregate([
      { $match: { organizationId } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products',
        },
      },
    ]);

    return result;
  }
}
