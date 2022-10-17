import {
    SearchableRepositoryInterface,
    SearchParams as DefaultSearchParams,
    SearchResult as DefaultSearchResult,
} from '../../../@seedwork/domain/repository/repository-contracts'
import { Category } from '../entities/category'

export namespace CategoryRepository {
    export type Filter = string

    export class SearchParams extends DefaultSearchParams<Filter> {}

    export class SearchResult extends DefaultSearchResult<Category, Filter> {}

    export interface IRepository
        extends SearchableRepositoryInterface<
            Category,
            Filter,
            SearchParams,
            SearchResult
        > {}
}

export default CategoryRepository

// este contrato foi criado para atender as necessidades adicionais da entity