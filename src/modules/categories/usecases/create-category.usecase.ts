import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { CreateCategoryInput } from './dto/create-category.input';
import { CategoryObj } from './dto/category.object';
import { CategoryDataSource } from '../datasources/category.datasource';

@Injectable()
export class CreateCategoryUseCase
  implements
    IBaseUseCase<CreateCategoryInput & { organizationId: string }, CategoryObj>
{
  constructor(private categoryDataSource: CategoryDataSource) {}

  async execute(
    input: CreateCategoryInput & { organizationId: string },
  ): Promise<CategoryObj> {
    return this.categoryDataSource.createOne(input);
  }
}
