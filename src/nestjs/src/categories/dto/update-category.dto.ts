import { UpdateCategoryUseCase } from '@fc/code-videos/category/application';

export class UpdateCategoryDto implements UpdateCategoryUseCase.Input {
  id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

// export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
//patch uma atualização parcial. PartialType ele pegar o tipo do create
