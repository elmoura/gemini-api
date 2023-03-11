import { Injectable } from '@nestjs/common';
import { AutoGeneratedFields } from '@shared/interfaces/auto-generated-fields';
import { Category } from '../entities/category';

interface ICategoryDataSource {
  createOne(payload: Omit<Category, AutoGeneratedFields>): Promise<Category>;
}

@Injectable()
export class CategoryDataSource implements ICategoryDataSource {}
