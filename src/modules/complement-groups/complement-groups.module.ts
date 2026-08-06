import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import {
  ComplementGroup,
  ComplementGroupSchema,
} from './entities/complement-group';
import { Complement, ComplementSchema } from './entities/complement';
import { ComplementGroupsResolver } from './complement-groups.resolver';
import { ComplementGroupDataSource } from './datasources/complement-group.datasource';
import { ComplementDataSource } from './datasources/complement.datasource';
import { CreateComplementGroupUseCase } from './usecases/create-complement-group.usecase';
import { UpdateComplementGroupUseCase } from './usecases/update-complement-group.usecase';
import {
  FindComplementGroupUseCase,
  ListComplementGroupsUseCase,
} from './usecases/list-find-complement-group.usecase';
import { CreateComplementUseCase } from './usecases/create-complement.usecase';
import { UpdateComplementUseCase } from './usecases/update-complement.usecase';
import {
  FindComplementUseCase,
  ListComplementsUseCase,
} from './usecases/list-find-complement.usecase';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ComplementGroup.name, schema: ComplementGroupSchema },
      { name: Complement.name, schema: ComplementSchema },
    ]),
  ],
  providers: [
    ComplementGroupsResolver,
    ComplementGroupDataSource,
    ComplementDataSource,
    CreateComplementGroupUseCase,
    UpdateComplementGroupUseCase,
    ListComplementGroupsUseCase,
    FindComplementGroupUseCase,
    CreateComplementUseCase,
    UpdateComplementUseCase,
    ListComplementsUseCase,
    FindComplementUseCase,
  ],
  exports: [ComplementGroupDataSource, ComplementDataSource],
})
export class ComplementGroupsModule {}
