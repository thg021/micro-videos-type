import {
    PaginationOutputDto,
    PaginationOutputMapper,
} from '../../../@seedwork/application/dto/pagination-output'
import { SearchInputDto } from '../../../@seedwork/application/dto/search-input'
import IUseCase from '../../../@seedwork/application/use-case'
import CategoryRepository from '../../domain/repository/category.repository'
import { CategoryOutputDTO, CategoryOutputMapper } from '../dto/category-output'

export namespace ListCategoriesUseCase {
    export type Input = SearchInputDto

    export type Output = PaginationOutputDto<CategoryOutputDTO>

    export class UseCase implements IUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.IRepository) {}
        async execute(input: Input): Promise<Output> {
            const params = new CategoryRepository.SearchParams(input)
            const searchResult = await this.categoryRepo.search(params)

            return this.toOutput(searchResult)
        }

        private toOutput(
            searchResult: CategoryRepository.SearchResult,
        ): Output {
            return {
                items: searchResult.items.map((i) =>
                    CategoryOutputMapper.toOutput(i),
                ),
                ...PaginationOutputMapper.toPaginationOutput(searchResult),
            }
        }
    }
}

export default ListCategoriesUseCase