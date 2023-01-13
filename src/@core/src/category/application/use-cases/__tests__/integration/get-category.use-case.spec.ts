import NotFoundError from '../../../../../@seedwork/domain/errors/not-found-error'
import GetCategoryUseCase from '../../get-category.use-case'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize'

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize

describe('CreateCategoryUseCase Integration Test', () => {
    let useCase: GetCategoryUseCase.UseCase
    let repository: CategorySequelize.CategorySequelizeRepository

    setupSequelize({ models: [CategoryModel] })

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        useCase = new GetCategoryUseCase.UseCase(repository)
    })
    it('should throws error when entity not found', async () => {
        await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new NotFoundError(`Entity Not Found using ID fake id`),
        )
    })

    it('should returns a category', async () => {
        const entity = await CategoryModel.factory().count(2).bulkCreate()
        const output = await useCase.execute({ id: entity[0].id })

        expect(output).toStrictEqual({
            id: entity[0].id,
            name: entity[0].name,
            description: entity[0].description,
            is_active: entity[0].is_active,
            created_at: entity[0].created_at,
        })
    })
})
