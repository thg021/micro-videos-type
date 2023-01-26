import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CATEGORIES_PROVIDERS } from './category.providers';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        ...Object.values(CATEGORIES_PROVIDERS.REPOSITORIES),
        ...Object.values(CATEGORIES_PROVIDERS.USE_CASES),
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
