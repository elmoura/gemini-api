import { OrganizationNotFoundException } from '@modules/organizations/errors/organization-not-found.exception';
import { ProductNotFoundException } from '../errors/product-not-found.exception';
import { FindProductUseCase } from './find-product.usecase';

describe('FindProductUseCase', () => {
  const productDataSource = {
    findById: jest.fn(),
  };

  const organizationExistsUseCase = {
    execute: jest.fn(),
  };

  const useCase = new FindProductUseCase(
    productDataSource as never,
    organizationExistsUseCase as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    organizationExistsUseCase.execute.mockResolvedValue(true);
  });

  it('retorna produto da unidade', async () => {
    productDataSource.findById.mockResolvedValue({
      _id: 'p1',
      organizationId: 'org-1',
      locationId: 'loc-1',
      name: 'X-Burger',
      isActive: true,
      originalPrice: 25,
      images: [],
    });

    const result = await useCase.execute({
      _id: 'p1',
      organizationId: 'org-1',
      locationId: 'loc-1',
    });

    expect(result.name).toBe('X-Burger');
  });

  it('lança erro quando produto não existe', async () => {
    productDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        _id: 'missing',
        organizationId: 'org-1',
        locationId: 'loc-1',
      }),
    ).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('lança erro quando produto é de outra unidade', async () => {
    productDataSource.findById.mockResolvedValue({
      _id: 'p1',
      organizationId: 'org-1',
      locationId: 'loc-2',
      name: 'X-Burger',
    });

    await expect(
      useCase.execute({
        _id: 'p1',
        organizationId: 'org-1',
        locationId: 'loc-1',
      }),
    ).rejects.toBeInstanceOf(ProductNotFoundException);
  });

  it('lança erro quando organização não existe', async () => {
    organizationExistsUseCase.execute.mockResolvedValue(false);

    await expect(
      useCase.execute({
        _id: 'p1',
        organizationId: 'org-1',
        locationId: 'loc-1',
      }),
    ).rejects.toBeInstanceOf(OrganizationNotFoundException);
  });
});
