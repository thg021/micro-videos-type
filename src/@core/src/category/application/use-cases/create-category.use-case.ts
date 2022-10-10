import IUseCase from '../../../@seedwork/application/use-case'
import { Category } from '../../domain/entities/category'
import CategoryRepository from '../../domain/repository/category.repository'
import { CategoryOutputMapper, CategoryOutputDTO } from '../dto/category-output'

export namespace CreateCategoryUseCase {
    export type Input = {
        name: string
        description?: string
        is_active?: boolean
    }

    export type Output = CategoryOutputDTO

    export class UseCase implements IUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.IRepository) {}

        async execute(input: Input): Promise<Output> {
            const entity = new Category(input)
            await this.categoryRepo.insert(entity)
            return CategoryOutputMapper.toOutput(entity)
        }
    }
}

export default CreateCategoryUseCase
