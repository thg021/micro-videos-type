import IUseCase from '@seedwork/application/use-case'
import CategoryRepository from 'category/domain/repository/category.repository'

export default class DeleteCategoryUseCase implements IUseCase<Input, Output> {
    constructor(private categoryRepo: CategoryRepository.IRepository) {}
    async execute(input: Input): Promise<void> {
        const entity = await this.categoryRepo.findById(input.id)
        await this.categoryRepo.delete(entity.id)
    }
}

type Input = {
    id: string
}

type Output = void
