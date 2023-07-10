import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './entities/product';
import { ProductResolver } from './product.resolver';
import { ProductDataSource } from './datasources/product.datasource';
import { CreateProductUseCase } from './usecases/create-product.usecase';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';

/**
 * @todo
 * Talvez no futuro seria legal adicionar complementos aos produtos.
 * Ex.: Lanche com +1 hamburguer adicional, complementos pro lanche, etc.
 */

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  providers: [
    ProductResolver,
    ProductDataSource,
    CreateProductUseCase,
    OrganizationDataSource,
  ],
})
export class ProductModule {}
