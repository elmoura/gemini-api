import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../entities/product';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';

interface IProductDataSource {
  findById(productId: string): Promise<Product>;
  createOne(payload: Omit<Product, AutoGeneratedFields>): Promise<Product>;
  findManyByIds(productIds: string[]): Promise<Product[]>;
}

@Injectable()
export class ProductDataSource implements IProductDataSource {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findById(productId: string): Promise<Product> {
    const result = await this.productModel.findById(productId);
    return result.toObject();
  }

  async findManyByIds(productIds: string[]): Promise<Product[]> {
    const result = await this.productModel.find({ _id: productIds });
    return result.map((item) => item.toObject());
  }

  async createOne(
    payload: Omit<Product, AutoGeneratedFields>,
  ): Promise<Product> {
    const result = await this.productModel.create(payload);
    return result.toObject();
  }
}
