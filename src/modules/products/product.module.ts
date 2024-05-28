import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product';
import { ProductResolver } from './product.resolver';
import { ProductDataSource } from './datasources/product.datasource';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import {
  Category,
  CategorySchema,
} from '@modules/categories/entities/category';
import {
  ProductCategory,
  ProductCategorySchema,
} from './entities/product-category';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { ProductCategoryDataSource } from './datasources/product-category.datasource';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import { AuthModule } from '@modules/auth/auth.module';
import { ListProductsUseCase } from './usecases/list-products.usecase';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';

/**
 * @todo
 * Talvez no futuro seria legal adicionar complementos aos produtos.
 * Ex.: Lanche com +1 hamburguer adicional, complementos pro lanche, etc.
 */

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: ProductCategory.name,
        schema: ProductCategorySchema,
      },
    ]),
  ],
  providers: [
    ProductResolver,
    ProductDataSource,
    CategoryDataSource,
    ProductCategoryDataSource,
    CreateProductUseCase,
    OrganizationDataSource,
    OrganizationExistsUseCase,
    ListProductsUseCase,
  ],
})
export class ProductModule {}
