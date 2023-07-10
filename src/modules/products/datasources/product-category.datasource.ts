import { Injectable } from '@nestjs/common';
import {
  ProductCategory,
  ProductCategoryDocument,
} from '../entities/product-category';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';
import { Model } from 'mongoose';

interface IProductCategoryDataSource {
  createOne(
    input: Omit<ProductCategory, AutoGeneratedFields>,
  ): Promise<ProductCategory>;
}

@Injectable()
export class ProductCategoryDataSource implements IProductCategoryDataSource {
  constructor(private productCategoryModel: Model<ProductCategoryDocument>) {}

  async createOne(
    input: Omit<ProductCategory, AutoGeneratedFields>,
  ): Promise<ProductCategory> {
    const result = await this.productCategoryModel.create(input);
    return result.toObject();
  }
}