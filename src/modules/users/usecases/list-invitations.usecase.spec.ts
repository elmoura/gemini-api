import { ListInvitationsUseCase } from './list-invitations.usecase';
import { InvitationStatus } from '../entities/invitation';

describe('ListInvitationsUseCase', () => {
  const invitationDataSource = {
    listByOrganization: jest.fn(),
  };

  const useCase = new ListInvitationsUseCase(invitationDataSource as never);

  beforeEach(() => {
    jest.clearAllMocks();
    invitationDataSource.listByOrganization.mockResolvedValue([]);
  });

  it('usa PENDING como status default quando nenhum é informado', async () => {
    await useCase.execute({ organizationId: 'org-1' });

    expect(invitationDataSource.listByOrganization).toHaveBeenCalledWith(
      'org-1',
      InvitationStatus.PENDING,
    );
  });

  it('respeita o status informado explicitamente', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      status: InvitationStatus.CANCELLED,
    });

    expect(invitationDataSource.listByOrganization).toHaveBeenCalledWith(
      'org-1',
      InvitationStatus.CANCELLED,
    );
  });
});
