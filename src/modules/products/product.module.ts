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
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import { AuthModule } from '@modules/auth/auth.module';
import { ListProductsUseCase } from './usecases/list-products.usecase';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { UpdateProductUsecase } from './usecases/update-product.usecase';
import { MoveProductImageUtil } from './utils/move-product-images-util';
import { UploadService } from '@shared/services/upload.service';

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
    ]),
  ],
  providers: [
    ProductResolver,
    ProductDataSource,
    CategoryDataSource,
    CreateProductUseCase,
    UpdateProductUsecase,
    OrganizationDataSource,
    OrganizationExistsUseCase,
    ListProductsUseCase,
    MoveProductImageUtil,
    UploadService,
  ],
})
export class ProductModule {}
