import { SearchProductUseCase } from './search-product.usecase';

describe('SearchProductUseCase', () => {
  const productDataSource = {
    searchByName: jest.fn(),
  };

  const useCase = new SearchProductUseCase(productDataSource as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna produtos que correspondem ao nome', async () => {
    productDataSource.searchByName.mockResolvedValue([
      {
        _id: 'p1',
        name: 'X-Burger',
        locationId: 'loc-1',
        organizationId: 'org-1',
        isActive: true,
        originalPrice: 25,
        images: [],
      },
    ]);

    const result = await useCase.execute({
      name: 'burger',
      organizationId: 'org-1',
      locationId: 'loc-1',
      limit: 20,
      offset: 0,
    });

    expect(productDataSource.searchByName).toHaveBeenCalledWith(
      {
        name: expect.any(RegExp),
        organizationId: 'org-1',
        locationId: 'loc-1',
      },
      { limit: 20, offset: 0 },
    );
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('X-Burger');
  });

  it('retorna lista vazia quando não há match', async () => {
    productDataSource.searchByName.mockResolvedValue([]);

    const result = await useCase.execute({
      name: 'inexistente',
      organizationId: 'org-1',
      locationId: 'loc-1',
    });

    expect(result.data).toHaveLength(0);
    expect(result.count).toBe(0);
  });
});
