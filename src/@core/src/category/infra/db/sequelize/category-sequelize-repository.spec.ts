import { Category, CategoryRepository } from '#category/domain'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import UniqueEntityId from '../../../../@seedwork/domain/value-objects/unique-entity-id.vo'
import { CategoryModel } from './category-model'
import { CategorySequelizeRepository } from './category-sequelize-repository'
import _chance from 'chance'
import { CategoryModelMapper } from './category-model-mapper'
describe('Category SequelizeRepository Unit Test', () => {
    setupSequelize({ models: [CategoryModel] })
    let chance: Chance.Chance
    let repository: CategorySequelizeRepository

    beforeAll(() => {
        chance = _chance()
    })

    beforeEach(async () => {
        repository = new CategorySequelizeRepository(CategoryModel)
    })

    describe('Insert Method', () => {
        it('should be able to insert a new entity', async () => {
            const category = new Category({ name: 'Movie' })
            await repository.insert(category)
            const modelCategory = await CategoryModel.findByPk(category.id)
            expect(modelCategory.toJSON()).toStrictEqual(category.toJSON())
        })
    })

    describe('FindbyId Method', () => {
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

    describe('FindAll Method', () => {
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

    describe('Search Method', () => {
        it('should only apply paginate when other params is null', async () => {
            const created_at = new Date()
            await CategoryModel.factory()
                .count(16)
                .bulkCreate(() => ({
                    id: chance.guid({ version: 4 }),
                    name: 'Movie',
                    description: null,
                    is_active: true,
                    created_at,
                }))

            const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity')
            const searchOutput = await repository.search(
                new CategoryRepository.SearchParams(),
            )

            expect(searchOutput).toBeInstanceOf(CategoryRepository.SearchResult)
            expect(searchOutput.toJSON()).toMatchObject({
                total: 16,
                current_page: 1,
                per_page: 15,
                last_page: 2,
                sort: null,
                sort_dir: null,
                filter: null,
            })
            expect(spyToEntity).toHaveBeenCalledTimes(15)

            searchOutput.items.forEach((item) => {
                expect(item).toBeInstanceOf(Category)
                expect(item.id).toBeDefined()
            })

            const items = searchOutput.items.map((item) => item.toJSON())
            expect(items).toMatchObject(
                new Array(15).fill({
                    name: 'Movie',
                    description: null,
                    is_active: true,
                    created_at,
                }),
            )
        })

        it('should order by created_at DESC when search params ara null', async () => {
            const created_at = new Date(0)
            await CategoryModel.factory()
                .count(16)
                .bulkCreate((index) => ({
                    id: chance.guid({ version: 4 }),
                    name: `Movie${index}`,
                    description: null,
                    is_active: true,
                    created_at: new Date(created_at.getTime() + 100 + index),
                }))
            const searchOutput = await repository.search(
                new CategoryRepository.SearchParams(),
            )
            const items = searchOutput.items
            items.reverse().forEach((item, index) => {
                expect(`${item.name}${index + 1}`)
            })
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
