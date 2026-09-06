// Template: usecases/create-__entity-name__.usecase.ts
// Este é o usecase mínimo de um módulo novo (ação "create"). Para adicionar find/
// list/update/search depois, use a skill new-usecase — ela segue este mesmo
// esqueleto (constructor injection, IBaseUseCase, exception nomeada em vez de
// erro genérico).
import { Injectable } from '@nestjs/common';
import { IBaseUseCase } from '@shared/interfaces/base-use-case';
import { OrganizationExistsUseCase } from '@modules/organizations/usecases/organization-exists.usecase';
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { __EntityName__DataSource } from '../datasources/__entityName__.datasource';
import { Create__EntityName__Input } from './dto/create-__entity-name__.input';
import { __EntityName__Obj } from './dto/__entity-name__.object';

@Injectable()
export class Create__EntityName__UseCase
  implements IBaseUseCase<Create__EntityName__Input, __EntityName__Obj>
{
  constructor(
    private __entityName__DataSource: __EntityName__DataSource,
    private organizationExistsUseCase: OrganizationExistsUseCase,
  ) {}

  async execute(
    input: Create__EntityName__Input,
  ): Promise<__EntityName__Obj> {
    const organizationExists = await this.organizationExistsUseCase.execute({
      organizationId: input.organizationId,
    });

    if (!organizationExists) {
      throw new OrganizationNotFoundException();
    }

    // TODO: validações de regra de negócio específicas do módulo entram aqui,
    // lançando uma exception nomeada de ../errors (nunca BadRequestException
    // genérica solta).

    return this.__entityName__DataSource.createOne({
      ...input,
      isActive: input.isActive ?? true,
    });
  }
}
