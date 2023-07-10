import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { CategoryDataSource } from '../datasources/category.datasource';
import { CreateCategoryInput } from './dto/create-category.input';
import { CategoryObj } from './dto/category.object';

@Injectable()
export class CreateCategoryUseCase
  implements
    IBaseUseCase<CreateCategoryInput & { organizationId: string }, CategoryObj>
{
  constructor(
    private categoryDataSource: CategoryDataSource,
    private organizationDataSource: OrganizationDataSource,
  ) {}

  async execute(
    input: CreateCategoryInput & { organizationId: string },
  ): Promise<CategoryObj> {
    const organizationExists = await this.organizationDataSource.findById(
      input.organizationId,
    );

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    return this.categoryDataSource.createOne(input);
  }
}
