import { CreateCategoryUseCase } from '@fc/code-videos/category/application';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

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

  it('should updates a category', () => {
    expect(controller).toBeDefined();
  });

  it('should delete a category', () => {
    expect(controller).toBeDefined();
  });

  it('should get a category', () => {
    expect(controller).toBeDefined();
  });

  it('should list categories', () => {
    expect(controller).toBeDefined();
  });
});
