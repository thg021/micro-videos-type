import NotFoundError from '../../../../../@seedwork/domain/errors/not-found-error'
import DeleteCategoryUseCase from '../../delete-category.use-case'
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize

describe('DeleteCategoryUseCase Unit Tests', () => {
    let repository: CategorySequelize.CategorySequelizeRepository
    let useCase: DeleteCategoryUseCase.UseCase

    setupSequelize({ models: [CategoryModel] })

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        useCase = new DeleteCategoryUseCase.UseCase(repository)
    })

    it('should throws error when entity not found', async () => {
        await expect(() =>
            useCase.execute({ id: 'fake id' }),
        ).rejects.toThrowError(
            new NotFoundError(`Entity Not Found using ID fake id`),
        )
    })

    it('should delete category', async () => {
        const entity = await CategoryModel.factory().create()
        await useCase.execute({ id: entity.id })
        const noHasModel = await CategoryModel.findByPk(entity.id)
        expect(noHasModel).toBeNull()
    })
})
