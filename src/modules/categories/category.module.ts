import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from '@modules/auth/services/token.service';
import {
  Organization,
  OrganizationSchema,
} from '@modules/organizations/entities/organization';
import { OrganizationDataSource } from '@modules/organizations/datasources/organization.datasource';
import { Category, CategorySchema } from './entities/category';
import { CategoryResolver } from './category.resolver';
import { CreateCategoryUseCase } from './usecases/create-category.usecase';
import { CategoryDataSource } from './datasources/category.datasource';

@Module({
  imports: [
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
    OrganizationDataSource,
  ],
})
export class CategoryModule {}
