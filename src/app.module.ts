import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from '@config/env';
import { OrganizationModule } from '@modules/organizations/organizations.module';

@Module({
  imports: [
    OrganizationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src', 'config', 'schema.gql'),
    }),
    MongooseModule.forRoot(Environment.mongodb.url),
  ],
})
export class AppModule {}
