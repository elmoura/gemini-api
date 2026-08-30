import { CancelInvitationUseCase } from './cancel-invitation.usecase';
import { InvitationStatus } from '../entities/invitation';
import { InvitationNotFoundError } from '../errors/invitation-not-found';
import { InvitationAlreadyUsedError } from '../errors/invitation-already-used';
import { InvitationCancelledError } from '../errors/invitation-cancelled';

describe('CancelInvitationUseCase', () => {
  const invitationDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  const useCase = new CancelInvitationUseCase(invitationDataSource as never);

  const pendingInvitation = {
    _id: 'invitation-1',
    organizationId: 'org-1',
    status: InvitationStatus.PENDING,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    invitationDataSource.findById.mockResolvedValue(pendingInvitation);
    invitationDataSource.updateOne.mockImplementation(async (_id, data) => ({
      ...pendingInvitation,
      ...data,
    }));
  });

  it('marca o convite pendente como cancelado', async () => {
    const result = await useCase.execute({
      invitationId: 'invitation-1',
      organizationId: 'org-1',
    });

    expect(invitationDataSource.updateOne).toHaveBeenCalledWith(
      'invitation-1',
      { status: InvitationStatus.CANCELLED },
    );
    expect(result.status).toBe(InvitationStatus.CANCELLED);
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

    expect(invitationDataSource.updateOne).not.toHaveBeenCalled();
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

    expect(invitationDataSource.updateOne).not.toHaveBeenCalled();
  });
});
