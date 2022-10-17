import {
  CreateCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/code-videos/category/application';
import { SortDirection } from '@fc/code-videos/dist/@seedwork/domain/repository/repository-contracts';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const expectedOutput: CreateCategoryUseCase.Output = {
      id: 'ed2b1809-cf53-41e0-9ebe-c7b3ef0e9d17',
      description: 'some description',
      name: 'Film',
      is_active: false,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateCategoryDto = {
      name: 'Film',
      description: 'some description',
    };

    const output = await controller.create(input);

    expect(mockCreateUseCase.execute).toBeCalled();
    expect(mockCreateUseCase.execute).toBeCalledWith(input);
    expect(controller).toBeDefined();
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should updates a category', async () => {
    const id = 'ed2b1809-cf53-41e0-9ebe-c7b3ef0e9d17';
    const expectedOutput: UpdateCategoryUseCase.Output = {
      id,
      name: 'Movie',
      is_active: false,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(expectedOutput),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: UpdateCategoryDto = {
      name: 'Movie',
      description: 'some description',
    };
    const output = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(expectedOutput).toStrictEqual(output);
    expect(controller).toBeDefined();
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should get a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const expectedOutput: GetCategoryUseCase.Output = {
      id,
      name: '',
      is_active: false,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    controller['getUseCase'] = mockGetUseCase;

    const output = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should list categories', async () => {
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test',
    };
    const output = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(expectedOutput).toStrictEqual(output);
  });
});
