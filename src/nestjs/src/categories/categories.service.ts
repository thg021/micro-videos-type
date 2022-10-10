import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
} from '@fc/code-videos/category/application';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private createUseCases: CreateCategoryUseCase.UseCase,
    private listUseCases: ListCategoriesUseCase.UseCase,
  ) {}

  create(createCategoryDto: CreateCategoryUseCase.Input) {
    return this.createUseCases.execute(createCategoryDto);
  }

  findAll(input: ListCategoriesUseCase.Input) {
    return this.listUseCases.execute(input);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
