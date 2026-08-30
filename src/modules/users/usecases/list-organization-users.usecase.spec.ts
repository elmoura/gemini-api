import { ListOrganizationUsersUseCase } from './list-organization-users.usecase';

describe('ListOrganizationUsersUseCase', () => {
  const userDataSource = {
    findManyByOrganization: jest.fn(),
  };

  const useCase = new ListOrganizationUsersUseCase(userDataSource as never);

  beforeEach(() => {
    jest.clearAllMocks();
    userDataSource.findManyByOrganization.mockResolvedValue({
      data: [{ _id: 'user-1' }],
      hasNextPage: false,
    });
  });

  it('usa page=1 e limit=20 como default e repassa organizationId ao datasource', async () => {
    const result = await useCase.execute({ organizationId: 'org-1' });

    expect(userDataSource.findManyByOrganization).toHaveBeenCalledWith(
      'org-1',
      { search: undefined, page: 1, limit: 20 },
    );
    expect(result).toEqual({
      data: [{ _id: 'user-1' }],
      page: 1,
      limit: 20,
      hasNextPage: false,
    });
  });

  it('repassa search, page e limit informados', async () => {
    await useCase.execute({
      organizationId: 'org-1',
      search: 'fulano',
      page: 2,
      limit: 5,
    });

    expect(userDataSource.findManyByOrganization).toHaveBeenCalledWith(
      'org-1',
      { search: 'fulano', page: 2, limit: 5 },
    );
  });

  it('devolve page/limit ecoados no output mesmo quando informados', async () => {
    const result = await useCase.execute({
      organizationId: 'org-1',
      page: 3,
      limit: 10,
    });

    expect(result.page).toBe(3);
    expect(result.limit).toBe(10);
  });
});
