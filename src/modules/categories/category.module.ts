import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from '@modules/auth/services/token.service';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import { Category, CategorySchema } from './entities/category';
import { CategoryResolver } from './category.resolver';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryDataSource } from './datasources/category.datasource';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationEntitiesModule } from '@modules/organizations/organization-entities.module';
import { ListCategoriesUseCase } from './usecases/list-categories.usecase';
import { CategoryProductsValidation } from './validations/category-products-validation';
import { UpdateCategoryUseCase } from './usecases/update-category.usecase';
import { FindCategoryUseCase } from './usecases/find-category.usecase';
import { Product, ProductSchema } from '@modules/products/entities/product';
import { ProductDataSource } from '@modules/products/datasources/product.datasource';

@Module({
  imports: [
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
  ],
  providers: [
    TokenService,
    ProductDataSource,
    CategoryResolver,
    CategoryDataSource,
    CreateCategoryUseCase,
    OrganizationExistsUseCase,
    ListCategoriesUseCase,
    CategoryProductsValidation,
    UpdateCategoryUseCase,
    FindCategoryUseCase,
  ],
})
export class CategoryModule {}
