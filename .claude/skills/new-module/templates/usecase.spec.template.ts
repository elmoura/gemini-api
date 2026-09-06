// Template: usecases/create-__entity-name__.usecase.spec.ts
// Casos mínimos obrigatórios (ver testing-standard.md): sucesso, not-found (aqui:
// organização), violação de regra de negócio (TODO: adaptar para a regra real do
// módulo) e "efeito colateral não deve ocorrer no caminho de erro". Isolamento
// multi-tenant é mais relevante em find/list/update — replicar esse padrão lá.
import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { Create__EntityName__UseCase } from './create-__entity-name__.usecase';

describe('Create__EntityName__UseCase', () => {
  const __entityName__DataSource = {
    createOne: jest.fn(),
  };

  const organizationExistsUseCase = {
    execute: jest.fn(),
  };

  const useCase = new Create__EntityName__UseCase(
    __entityName__DataSource as never,
    organizationExistsUseCase as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    organizationExistsUseCase.execute.mockResolvedValue(true);
  });

  it('cria __entity-name-pt__ com sucesso', async () => {
    const created = {
      _id: '__entityName__-1',
      organizationId: 'org-1',
      locationId: 'loc-1',
      isActive: true,
      name: 'Exemplo',
    };
    __entityName__DataSource.createOne.mockResolvedValue(created);

    const result = await useCase.execute({
      organizationId: 'org-1',
      locationId: 'loc-1',
      name: 'Exemplo',
    } as never);

    expect(__entityName__DataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Exemplo', isActive: true }),
    );
    expect(result).toEqual(created);
  });

  it('lança erro quando organização não existe', async () => {
    organizationExistsUseCase.execute.mockResolvedValue(false);

    await expect(
      useCase.execute({
        organizationId: 'missing',
        locationId: 'loc-1',
        name: 'Exemplo',
      } as never),
    ).rejects.toBeInstanceOf(OrganizationNotFoundException);

    expect(__entityName__DataSource.createOne).not.toHaveBeenCalled();
  });

  // TODO: caso de violação de regra de negócio específica do módulo, ex.:
  // it('lança erro quando <regra do módulo>', async () => { ... });
});
