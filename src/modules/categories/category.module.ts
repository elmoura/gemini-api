import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities/category';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryDataSource } from './datasources/category.datasource';
import { CategoryResolver } from './category.resolver';
import { TokenService } from '@shared/services/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [
    TokenService,
    CategoryResolver,
    CategoryDataSource,
    CreateCategoryUseCase,
  ],
})
export class CategoryModule {}
