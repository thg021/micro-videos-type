import { Category } from '../../../../category/domain/entities/category'
import NotFoundError from '../../../../@seedwork/domain/errors/not-found-error'
import CategoryInMemoryRepository from '../../../../category/infra/repository/category-in-memory.repository'
import DeleteCategoryUseCase from '../delete-category.use-case'

describe('DeleteCategoryUseCase Unit Tests', () => {
    let repository: CategoryInMemoryRepository
    let useCase: DeleteCategoryUseCase.UseCase

    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        useCase = new DeleteCategoryUseCase.UseCase(repository)
    })

    it('should throws error when entity not found', async () => {
        expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrowError(
            new NotFoundError(`Entity Not Found using ID fake id`),
        )
    })

    it('should delete category', async () => {
        const spyUpdate = jest.spyOn(repository, 'delete')
        const entity = new Category({ name: 'Movie' })
        repository.items = [entity]

        await useCase.execute({ id: entity.id })
        expect(spyUpdate).toHaveBeenCalledTimes(1)
        expect(repository.items).toHaveLength(0)
    })
})
