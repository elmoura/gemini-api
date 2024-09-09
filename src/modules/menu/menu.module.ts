import { Module } from '@nestjs/common';
// import { MenuResolver } from './menu.resolver';
import { MenuDataSource } from './datasources/menu.datasource';
// import { GetMenuUseCase } from './usecases/get-menu.usecase';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from '@modules/categories/entities/category';
import { Product, ProductSchema } from '@modules/products/entities/product';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationEntitiesModule } from '@modules/organizations/organization-entities.module';

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
    ]),
  ],
  providers: [
    // MenuResolver,
    MenuDataSource,
    // GetMenuUseCase,
    OrganizationExistsUseCase,
  ],
})
export class MenuModule {}
