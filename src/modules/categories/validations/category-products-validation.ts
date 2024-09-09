import { ProductDataSource } from '@modules/products/datasources/product.datasource';
import { Injectable } from '@nestjs/common';

type Params = {
  organizationId: string;
  productIds: string[];
};

type Result = {
  invalidProductIds: string[];
};

@Injectable()
export class CategoryProductsValidation {
  constructor(private productDataSource: ProductDataSource) {}

  async execute(params: Params): Promise<Result> {
    const invalidProductIds = [];

    await Promise.all(
      params.productIds.map(async (productId) => {
        const product = await this.productDataSource.findById(productId);

        if (!product || product.organizationId !== params.organizationId) {
          invalidProductIds.push(productId);
        }
      }),
    );

    return { invalidProductIds };
  }
}
