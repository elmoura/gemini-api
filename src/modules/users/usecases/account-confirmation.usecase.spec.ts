import { AccountConfirmationUseCase } from './account-confirmation.usecase';
import { InvitationStatus } from '../entities/invitation';
import { OrganizationRole } from '../enums/organization-role';
import { AccountStatuses } from '../enums/account-confirmation-statuses';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';
import { InvitationExpiredError } from '../errors/invitation-expired';

describe('AccountConfirmationUseCase', () => {
  const cryptoService = {
    encrypt: jest.fn().mockReturnValue('encrypted-password'),
  };
  const userDataSource = {
    createOne: jest.fn(),
  };
  const invitationDataSource = {
    findByToken: jest.fn(),
    updateOne: jest.fn(),
  };

  const useCase = new AccountConfirmationUseCase(
    cryptoService as never,
    userDataSource as never,
    invitationDataSource as never,
  );

  const pendingInvitation = {
    _id: 'invitation-1',
    organizationId: 'org-1',
    email: 'convidado@chefin.com',
    roles: [OrganizationRole.WAITER],
    status: InvitationStatus.PENDING,
    token: 'valid-token',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  };

  const input = {
    token: 'valid-token',
    firstName: 'Fulano',
    lastName: 'Silva',
    phoneNumber: undefined,
    password: 'senha12345',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    invitationDataSource.findByToken.mockResolvedValue(pendingInvitation);
    userDataSource.createOne.mockImplementation(async (data) => ({
      _id: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }));
  });

  it('cria o usuário com as roles do convite e marca o convite como aceito', async () => {
    const result = await useCase.execute(input);

    expect(userDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-1',
        email: 'convidado@chefin.com',
        roles: [OrganizationRole.WAITER],
        firstName: 'Fulano',
        lastName: 'Silva',
        password: 'encrypted-password',
        accountStatus: AccountStatuses.CONFIRMED,
      }),
    );
    expect(invitationDataSource.updateOne).toHaveBeenCalledWith(
      'invitation-1',
      { status: InvitationStatus.ACCEPTED },
    );
    expect(result._id).toBe('user-1');
  });

  it('rejeita quando o token não corresponde a nenhum convite', async () => {
    invitationDataSource.findByToken.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvitationNotFoundError,
    );
    expect(userDataSource.createOne).not.toHaveBeenCalled();
  });

  it('rejeita quando o convite já foi cancelado', async () => {
    invitationDataSource.findByToken.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.CANCELLED,
    });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvitationCancelledError,
    );
    expect(userDataSource.createOne).not.toHaveBeenCalled();
  });

  it('rejeita quando o convite já foi aceito', async () => {
    invitationDataSource.findByToken.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.ACCEPTED,
    });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvitationAlreadyUsedError,
    );
    expect(userDataSource.createOne).not.toHaveBeenCalled();
  });

  it('rejeita e marca como EXPIRED quando expiresAt já passou, mesmo com status ainda PENDING', async () => {
    invitationDataSource.findByToken.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() - 1000),
    });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      InvitationExpiredError,
    );
    expect(invitationDataSource.updateOne).toHaveBeenCalledWith(
      'invitation-1',
      { status: InvitationStatus.EXPIRED },
    );
    expect(userDataSource.createOne).not.toHaveBeenCalled();
  });
});
