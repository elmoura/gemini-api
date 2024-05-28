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

@Module({
  imports: [
    OrganizationEntitiesModule,
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Organization.name,
        schema: OrganizationSchema,
      },
    ]),
  ],
  providers: [
    TokenService,
    CategoryResolver,
    CategoryDataSource,
    CreateCategoryUseCase,
    OrganizationExistsUseCase,
    ListCategoriesUseCase,
  ],
})
export class CategoryModule {}
