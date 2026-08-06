import { CategoryNotFoundException } from '../errors/category-not-found.exception';
import { UpdateCategoryUseCase } from './update-category.usecase';

describe('UpdateCategoryUseCase', () => {
  const categoryDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
    addProductsToCategory: jest.fn(),
    removeProductsFromCategory: jest.fn(),
  };

  const categoryProductsValidation = {
    execute: jest.fn(),
  };

  const useCase = new UpdateCategoryUseCase(
    categoryDataSource as never,
    categoryProductsValidation as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('atualiza categoria com isActive', async () => {
    categoryDataSource.findById
      .mockResolvedValueOnce({
        _id: 'cat-1',
        organizationId: 'org-1',
        productIds: [],
      })
      .mockResolvedValueOnce({
        _id: 'cat-1',
        name: 'Lanches',
        isActive: false,
        productIds: [],
      });

    categoryDataSource.updateOne.mockResolvedValue(true);

    const result = await useCase.execute({
      _id: 'cat-1',
      organizationId: 'org-1',
      locationId: 'loc-1',
      isActive: false,
    });

    expect(categoryDataSource.updateOne).toHaveBeenCalledWith('cat-1', {
      name: undefined,
      description: undefined,
      isActive: false,
    });
    expect(result.isActive).toBe(false);
  });

  it('lança erro quando categoria não existe', async () => {
    categoryDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        _id: 'missing',
        organizationId: 'org-1',
        locationId: 'loc-1',
        name: 'Nova',
      }),
    ).rejects.toBeInstanceOf(CategoryNotFoundException);
  });
});
