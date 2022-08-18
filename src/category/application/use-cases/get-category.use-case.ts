import IUseCase from '../../../@seedwork/application/use-case'
import CategoryRepository from '../../domain/repository/category.repository'
import { CategoryOutputMapper } from '../dto/category-output'
import { CategoryOutputDTO } from '../dto/category-output'

export default class GetCategoryUseCase implements IUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.IRepository) {}
    async execute(input: Input): Promise<Output> {
        const entity = await this.categoryRepo.findById(input.id)
        return CategoryOutputMapper.toOutput(entity)
    }
}

export type Input = {
    id: string
}

export type Output = CategoryOutputDTO
