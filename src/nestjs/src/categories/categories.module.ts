import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/code-videos/category/application';
import { CategoryInMemoryRepository } from '@fc/code-videos/category/infra';
import CategoryRepository from '@fc/code-videos/dist/category/domain/repository/category.repository';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.IRepository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.IRepository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.IRepository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.IRepository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.IRepository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryInMemoryRepository'],
    },
  ],
})
export class CategoriesModule {}
