import { InvalidCategoryIdsException } from '../errors/invalid-category-ids.exeception';
import { MenuNotFoundException } from '../errors/menu-not-found.exception';
import { UpdateMenuUseCase } from './update-menu.usecase';

describe('UpdateMenuUseCase', () => {
  const menuDataSource = {
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  const menuCategoriesValidation = {
    execute: jest.fn(),
  };

  const useCase = new UpdateMenuUseCase(
    menuDataSource as never,
    menuCategoriesValidation as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('atualiza menu com sucesso', async () => {
    menuDataSource.findById
      .mockResolvedValueOnce({
        _id: 'menu-1',
        name: 'Antigo',
        categoryIds: [],
      })
      .mockResolvedValueOnce({
        _id: 'menu-1',
        name: 'Novo',
        types: ['SERVICE'],
        isActive: true,
        categoryIds: ['cat-1'],
      });

    menuCategoriesValidation.execute.mockResolvedValue({
      invalidCategoryIds: [],
    });
    menuDataSource.updateOne.mockResolvedValue(true);

    const result = await useCase.execute({
      _id: 'menu-1',
      organizationId: 'org-1',
      locationId: 'loc-1',
      name: 'Novo',
      categoryIds: ['cat-1'],
    });

    expect(menuDataSource.updateOne).toHaveBeenCalledWith('menu-1', {
      name: 'Novo',
      description: undefined,
      isActive: undefined,
      types: undefined,
      categoryIds: ['cat-1'],
    });
    expect(result.name).toBe('Novo');
  });

  it('lança erro quando menu não existe', async () => {
    menuDataSource.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        _id: 'missing',
        organizationId: 'org-1',
        locationId: 'loc-1',
        name: 'Novo',
      }),
    ).rejects.toBeInstanceOf(MenuNotFoundException);
  });

  it('lança erro quando categoryIds são inválidos', async () => {
    menuDataSource.findById.mockResolvedValue({
      _id: 'menu-1',
      categoryIds: [],
    });
    menuCategoriesValidation.execute.mockResolvedValue({
      invalidCategoryIds: ['bad-cat'],
    });

    await expect(
      useCase.execute({
        _id: 'menu-1',
        organizationId: 'org-1',
        locationId: 'loc-1',
        categoryIds: ['bad-cat'],
      }),
    ).rejects.toBeInstanceOf(InvalidCategoryIdsException);
  });
});
