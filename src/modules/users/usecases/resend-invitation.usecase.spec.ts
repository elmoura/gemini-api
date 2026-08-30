import { ResendInvitationUseCase } from './resend-invitation.usecase';
import { InvitationStatus } from '../entities/invitation';
import { OrganizationRole } from '../enums/organization-role';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';
import { InvitationExpiredError } from '../errors/invitation-expired';

describe('ResendInvitationUseCase', () => {
  const emailService = {
    sendMail: jest.fn(),
  };
  const invitationDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  const useCase = new ResendInvitationUseCase(
    emailService as never,
    invitationDataSource as never,
  );

  const pendingInvitation = {
    _id: 'invitation-1',
    organizationId: 'org-1',
    email: 'convidado@chefin.com',
    roles: [OrganizationRole.WAITER],
    status: InvitationStatus.PENDING,
    token: 'old-token',
    expiresAt: new Date('2026-09-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    invitationDataSource.findById.mockResolvedValue(pendingInvitation);
    invitationDataSource.updateOne.mockImplementation(async (_id, data) => ({
      ...pendingInvitation,
      ...data,
    }));
  });

  it('regenera token e expiração e reenvia o e-mail para convite pendente', async () => {
    await useCase.execute({
      invitationId: 'invitation-1',
      organizationId: 'org-1',
    });

    expect(invitationDataSource.updateOne).toHaveBeenCalledWith(
      'invitation-1',
      expect.objectContaining({
        token: expect.any(String),
        expiresAt: expect.any(Date),
      }),
    );
    const [, updatePayload] = invitationDataSource.updateOne.mock.calls[0];
    expect(updatePayload.token).not.toBe('old-token');
    expect(emailService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'convidado@chefin.com' }),
    );
  });

  it('rejeita quando o convite não existe', async () => {
    invitationDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        invitationId: 'invitation-1',
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(InvitationNotFoundError);
  });

  it('rejeita quando o convite já foi cancelado', async () => {
    invitationDataSource.findById.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.CANCELLED,
    });

    await expect(
      useCase.execute({
        invitationId: 'invitation-1',
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(InvitationCancelledError);
  });

  it('rejeita quando o convite já foi aceito', async () => {
    invitationDataSource.findById.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.ACCEPTED,
    });

    await expect(
      useCase.execute({
        invitationId: 'invitation-1',
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(InvitationAlreadyUsedError);
  });

  it('rejeita quando o convite já expirou', async () => {
    invitationDataSource.findById.mockResolvedValue({
      ...pendingInvitation,
      status: InvitationStatus.EXPIRED,
    });

    await expect(
      useCase.execute({
        invitationId: 'invitation-1',
        organizationId: 'org-1',
      }),
    ).rejects.toBeInstanceOf(InvitationExpiredError);
  });
});
