import { Module } from '@nestjs/common';
import { MenuDataSource } from './datasources/menu.datasource';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from '@modules/categories/entities/category';
import { Product, ProductSchema } from '@modules/products/entities/product';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationEntitiesModule } from '@modules/organizations/organization-entities.module';
import { MenuCategoriesValidation } from './validations/menu-categories.validation';
import { MenuResolver } from './menu.resolver';
import { CreateMenuUseCase } from './usecases/create-menu.usecase';
import { Menu, MenuSchema } from './entities/menu';
import { CategoryDataSource } from '@modules/categories/datasources/category.datasource';
import { AuthModule } from '@modules/auth/auth.module';
import { GetLocationMenusUseCase } from './usecases/get-menu.usecase';

@Module({
  imports: [
    AuthModule,
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
        name: Menu.name,
        schema: MenuSchema,
      },
    ]),
  ],
  providers: [
    MenuResolver,
    MenuDataSource,
    CategoryDataSource,
    CreateMenuUseCase,
    MenuCategoriesValidation,
    GetLocationMenusUseCase,
    OrganizationExistsUseCase,
  ],
})
export class MenuModule {}
