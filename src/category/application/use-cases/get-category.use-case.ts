import CategoryRepository from '../../domain/repository/category.repository'
import { CategoryOutputDTO } from '../dto/category-output.dto'

export default class GetCategoryUseCase {
    constructor(private categoryRepo: CategoryRepository.IRepository) {}
    async execute(input: Input): Promise<Output> {
        const entity = await this.categoryRepo.findById(input.id)
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        }
    }
}

export type Input = {
    id: string
}

export type Output = CategoryOutputDTO
