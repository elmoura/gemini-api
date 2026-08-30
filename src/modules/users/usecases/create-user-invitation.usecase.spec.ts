import { CreateUserInvitationUseCase } from './create-user-invitation.usecase';
import { OrganizationRole } from '../enums/organization-role';
import { InvitationStatus } from '../entities/invitation';
import { UserAlreadyExistsError } from '../errors/user-already-exists';
import { InvitationAlreadyPendingError } from '../errors/invitation-already-pending';

describe('CreateUserInvitationUseCase', () => {
  const emailService = {
    sendMail: jest.fn(),
  };
  const userDataSource = {
    findByEmail: jest.fn(),
  };
  const invitationDataSource = {
    findPendingByOrgAndEmail: jest.fn(),
    createOne: jest.fn(),
  };

  const useCase = new CreateUserInvitationUseCase(
    emailService as never,
    userDataSource as never,
    invitationDataSource as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    userDataSource.findByEmail.mockResolvedValue(null);
    invitationDataSource.findPendingByOrgAndEmail.mockResolvedValue(null);
    invitationDataSource.createOne.mockImplementation(async (data) => ({
      _id: 'invitation-id',
      createdAt: new Date('2026-08-30T10:00:00.000Z'),
      updatedAt: new Date('2026-08-30T10:00:00.000Z'),
      ...data,
    }));
  });

  it('cria convite pendente e envia e-mail quando não há usuário nem convite pendente', async () => {
    const result = await useCase.execute({
      email: 'convidado@chefin.com',
      roles: [OrganizationRole.WAITER],
      organizationId: 'org-1',
      invitedByUserId: 'admin-1',
    });

    expect(invitationDataSource.createOne).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org-1',
        email: 'convidado@chefin.com',
        roles: [OrganizationRole.WAITER],
        status: InvitationStatus.PENDING,
        invitedByUserId: 'admin-1',
        token: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    );
    expect(emailService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'convidado@chefin.com' }),
    );
    expect(result._id).toBe('invitation-id');
  });

  it('rejeita quando já existe usuário confirmado com esse e-mail', async () => {
    userDataSource.findByEmail.mockResolvedValue({ _id: 'user-1' });

    await expect(
      useCase.execute({
        email: 'convidado@chefin.com',
        roles: [OrganizationRole.WAITER],
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

    expect(invitationDataSource.createOne).not.toHaveBeenCalled();
    expect(emailService.sendMail).not.toHaveBeenCalled();
  });

  it('rejeita quando já existe convite pendente para o mesmo e-mail na organização', async () => {
    invitationDataSource.findPendingByOrgAndEmail.mockResolvedValue({
      _id: 'existing-invitation',
    });

    await expect(
      useCase.execute({
        email: 'convidado@chefin.com',
        roles: [OrganizationRole.WAITER],
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(InvitationAlreadyPendingError);

    expect(invitationDataSource.createOne).not.toHaveBeenCalled();
    expect(emailService.sendMail).not.toHaveBeenCalled();
  });
});
