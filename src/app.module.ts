import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from '@config/env';
import { OrganizationModule } from '@modules/organizations/organizations.module';
import { UserModule } from '@modules/users/users.module';
import { CategoryModule } from '@modules/categories/category.module';
import { ProductModule } from '@modules/products/product.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src', 'config', 'schema.gql'),
    }),
    MongooseModule.forRoot(Environment.mongodb.url),
    AuthModule,
    ProductModule,
    UserModule,
    OrganizationModule,
    CategoryModule,
  ],
  providers: [],
})
export class AppModule {}
