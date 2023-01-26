import IUseCase from '@seedwork/application/use-case'
import CategoryRepository from 'category/domain/repository/category.repository'

export namespace DeleteCategoryUseCase {
    export type Input = {
        id: string
    }

    export type Output = void

    export class UseCase implements IUseCase<Input, Output> {
        constructor(private categoryRepo: CategoryRepository.IRepository) {}
        async execute(input: Input): Promise<void> {
            const entity = await this.categoryRepo.findById(input.id)
            await this.categoryRepo.delete(entity.id)
        }
    }
}

export default DeleteCategoryUseCase
