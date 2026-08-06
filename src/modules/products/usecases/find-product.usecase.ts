import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { ProductDataSource } from '../datasources/product.datasource';
import { FindProductInput } from './dto/find-product.input';
import { ProductObj } from './dto/product.object';
import { ProductNotFoundException } from '../errors/product-not-found.exception';

@Injectable()
export class FindProductUseCase implements IBaseUseCase<FindProductInput, ProductObj> {
  constructor(
    private productDataSource: ProductDataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute(input: FindProductInput): Promise<ProductObj> {
    const { _id, organizationId, locationId } = input;

    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId,
    });

    if (!organizationExists) throw new OrganizationNotFoundException();

    const product = await this.productDataSource.findById(_id);

    if (
      !product ||
      product.organizationId !== organizationId ||
      product.locationId !== locationId
    ) {
      throw new ProductNotFoundException(_id);
    }

    return product as ProductObj;
  }
}
