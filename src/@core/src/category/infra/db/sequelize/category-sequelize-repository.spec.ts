import { Category } from '#category/domain'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import UniqueEntityId from '../../../../@seedwork/domain/value-objects/unique-entity-id.vo'
import { CategoryModel } from './category-model'
import { CategorySequelizeRepository } from './category-sequelize-repository'

describe('Category SequelizeRepository Unit Test', () => {
    setupSequelize({ models: [CategoryModel] })
    let repository: CategorySequelizeRepository

    beforeEach(async () => {
        repository = new CategorySequelizeRepository(CategoryModel)
    })

    describe('Insert', () => {
        it('should be able to insert a new entity', async () => {
            const category = new Category({ name: 'Movie' })
            await repository.insert(category)
            const modelCategory = await CategoryModel.findByPk(category.id)
            expect(modelCategory.toJSON()).toStrictEqual(category.toJSON())
        })
    })

    describe('FindbyId', () => {
        it('Should return error when not find a category by id', async () => {
            await expect(() =>
                repository.findById('invalid_id'),
            ).rejects.toThrowError('Entity Not Found using ID invalid_id')

            await expect(() =>
                repository.findById(
                    new UniqueEntityId('365cd35e-297d-4257-9d9f-d9bfafcf1abc'),
                ),
            ).rejects.toThrowError(
                'Entity Not Found using ID 365cd35e-297d-4257-9d9f-d9bfafcf1abc',
            )
        })

        it('should be able to find by id category', async () => {
            const category = new Category({ name: 'Movie' })
            await repository.insert(category)
            const categoryFound = await repository.findById(category.id)
            expect(categoryFound.toJSON()).toStrictEqual(category.toJSON())
        })
    })

    describe('FindAll', () => {
        it('should return empty categories', async () => {
            const categories = await repository.findAll()
            expect(categories.length).toBe(0)
        })
        it('should return categories', async () => {
            const categoryA = new Category({ name: 'Movie' })
            const categoryB = new Category({
                name: 'Movie',
                description: 'description',
            })
            await repository.insert(categoryA)
            await repository.insert(categoryB)
            const categories = await repository.findAll()
            expect(categories.length).toBe(2)
            expect(categories[0].toJSON()).toStrictEqual(categoryA.toJSON())
            expect(categories[1].toJSON()).toStrictEqual(categoryB.toJSON())
            expect(categories[1].description).toBe('description')
        })
    })

    describe('Search', () => {
        it('should return categories', async () => {
            const test = await CategoryModel.factory().create()
            console.log(test)
            console.log(await CategoryModel.findAll())
        })
    })

    // describe('Update', () => {
    //     it('should updates an entity', async () => {
    //         const category = new Category({ name: 'Movie' })
    //         await repository.insert(category)

    //         const updatedCategory = new Category(
    //             { name: 'horror' },
    //             category.uniqueEntityId,
    //         )
    //         await repository.update(updatedCategory)

    //         expect(updatedCategory.toJSON()).toStrictEqual(category.toJSON())
    //     })
    // })

    // it.todo('should be able to update an existing entity', async () => {})
})
