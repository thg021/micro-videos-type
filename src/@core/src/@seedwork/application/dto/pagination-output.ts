import { SearchResult } from '../../domain/repository/repository-contracts'

export type PaginationOutputDto<Items = any> = {
    items: Items[]
    total: number
    current_page: number
    last_page: number
    per_page: number
}

//Uma mapeador que ira receber algo e devolver convertido em um objeto
//Neste caso estamos devolvendo tudo sobre pagination
export class PaginationOutputMapper {
    static toPaginationOutput(
        result: SearchResult,
    ): Omit<PaginationOutputDto, 'items'> {
        return {
            current_page: result.current_page,
            last_page: result.last_page,
            per_page: result.per_page,
            total: result.total,
        }
    }
}
