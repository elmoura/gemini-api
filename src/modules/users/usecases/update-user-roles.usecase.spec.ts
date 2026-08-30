import { UpdateUserRolesUseCase } from './update-user-roles.usecase';
import { OrganizationRole } from '../enums/organization-role';
import { UserNotFoundError } from '../errors/user-not-found';
import { LastAdminError } from '../errors/last-admin';

describe('UpdateUserRolesUseCase', () => {
  const userDataSource = {
    findById: jest.fn(),
    countByOrganizationAndRole: jest.fn(),
    updateRoles: jest.fn(),
  };

  const useCase = new UpdateUserRolesUseCase(userDataSource as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('atualiza as roles de um usuário sem ADMIN sem checar contagem de admins', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.WAITER],
    });
    userDataSource.updateRoles.mockResolvedValue({
      _id: 'user-1',
      roles: [OrganizationRole.CASHIER],
    });

    const result = await useCase.execute({
      userId: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.CASHIER],
    });

    expect(userDataSource.countByOrganizationAndRole).not.toHaveBeenCalled();
    expect(userDataSource.updateRoles).toHaveBeenCalledWith('user-1', 'org-1', [
      OrganizationRole.CASHIER,
    ]);
    expect(result.roles).toEqual([OrganizationRole.CASHIER]);
  });

  it('rejeita quando o usuário não existe', async () => {
    userDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        organizationId: 'org-1',
        roles: [OrganizationRole.WAITER],
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);

    expect(userDataSource.updateRoles).not.toHaveBeenCalled();
  });

  it('rejeita quando o usuário pertence a outra organização', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'other-org',
      roles: [OrganizationRole.WAITER],
    });

    await expect(
      useCase.execute({
        userId: 'user-1',
        organizationId: 'org-1',
        roles: [OrganizationRole.WAITER],
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);

    expect(userDataSource.updateRoles).not.toHaveBeenCalled();
  });

  it('rejeita remover ADMIN quando o usuário é o único admin da organização', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.ADMIN],
    });
    userDataSource.countByOrganizationAndRole.mockResolvedValue(1);

    await expect(
      useCase.execute({
        userId: 'user-1',
        organizationId: 'org-1',
        roles: [OrganizationRole.WAITER],
      }),
    ).rejects.toBeInstanceOf(LastAdminError);

    expect(userDataSource.countByOrganizationAndRole).toHaveBeenCalledWith(
      'org-1',
      OrganizationRole.ADMIN,
    );
    expect(userDataSource.updateRoles).not.toHaveBeenCalled();
  });

  it('aceita remover ADMIN quando existe mais de um admin na organização', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.ADMIN],
    });
    userDataSource.countByOrganizationAndRole.mockResolvedValue(2);
    userDataSource.updateRoles.mockResolvedValue({
      _id: 'user-1',
      roles: [OrganizationRole.MANAGER],
    });

    const result = await useCase.execute({
      userId: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.MANAGER],
    });

    expect(userDataSource.updateRoles).toHaveBeenCalledWith('user-1', 'org-1', [
      OrganizationRole.MANAGER,
    ]);
    expect(result.roles).toEqual([OrganizationRole.MANAGER]);
  });

  it('não conta admins quando o usuário continua ADMIN no novo array', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.ADMIN],
    });
    userDataSource.updateRoles.mockResolvedValue({
      _id: 'user-1',
      roles: [OrganizationRole.ADMIN, OrganizationRole.MANAGER],
    });

    await useCase.execute({
      userId: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.ADMIN, OrganizationRole.MANAGER],
    });

    expect(userDataSource.countByOrganizationAndRole).not.toHaveBeenCalled();
  });

  it('rejeita quando a atualização no banco não encontra o usuário (corrida)', async () => {
    userDataSource.findById.mockResolvedValue({
      _id: 'user-1',
      organizationId: 'org-1',
      roles: [OrganizationRole.WAITER],
    });
    userDataSource.updateRoles.mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-1',
        organizationId: 'org-1',
        roles: [OrganizationRole.CASHIER],
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
