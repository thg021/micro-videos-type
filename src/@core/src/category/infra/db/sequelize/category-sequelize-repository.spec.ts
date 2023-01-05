import { Category, CategoryRepository } from '#category/domain'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo'
import _chance from 'chance'
import { CategorySequelize } from './category-sequelize'
const { CategoryModel, CategoryModelMapper, CategorySequelizeRepository } =
    CategorySequelize
const chance = _chance()

describe('Category SequelizeRepository Unit Test', () => {
    setupSequelize({ models: [CategoryModel] })

    let repository: CategorySequelize.CategorySequelizeRepository

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

        it('should only apply paginate and filter', async () => {
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            }

            const categoryProps = [
                {
                    id: chance.guid({ version: 4 }),
                    name: 'test',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'a',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'TEST',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'Test',
                    ...defaultProps,
                },
            ]

            const categories = await CategoryModel.bulkCreate(categoryProps)
            let result = await repository.search(
                new CategoryRepository.SearchParams({
                    page: 1,
                    per_page: 2,
                    filter: 'TEST',
                }),
            )

            expect(result.toJSON(true)).toMatchObject(
                new CategoryRepository.SearchResult({
                    items: [
                        CategoryModelMapper.toEntity(categories[0]),
                        CategoryModelMapper.toEntity(categories[2]),
                    ],
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    sort: null,
                    sort_dir: null,
                    filter: 'TEST',
                }).toJSON(true),
            )

            result = await repository.search(
                new CategoryRepository.SearchParams({
                    page: 2,
                    per_page: 2,
                    filter: 'TEST',
                }),
            )

            expect(result.toJSON(true)).toMatchObject(
                new CategoryRepository.SearchResult({
                    items: [CategoryModelMapper.toEntity(categories[3])],
                    total: 3,
                    current_page: 2,
                    per_page: 2,
                    sort: null,
                    sort_dir: null,
                    filter: 'TEST',
                }).toJSON(true),
            )
        })

        it('should apply paginate and sort', async () => {
            expect(repository.sortableFields).toStrictEqual([
                'name',
                'created_at',
            ])
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            }

            const categoryProps = [
                {
                    id: chance.guid({ version: 4 }),
                    name: 'b',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'a',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'd',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'e',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'c',
                    ...defaultProps,
                },
            ]

            const categories = await CategoryModel.bulkCreate(categoryProps)

            const arrange = [
                {
                    params: new CategoryRepository.SearchParams({
                        page: 1,
                        per_page: 2,
                        sort: 'name',
                    }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[1]),
                            CategoryModelMapper.toEntity(categories[0]),
                        ],
                        total: 5,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    }),
                },
                {
                    params: new CategoryRepository.SearchParams({
                        page: 2,
                        per_page: 2,
                        sort: 'name',
                    }),
                    result: new CategoryRepository.SearchResult({
                        items: [
                            CategoryModelMapper.toEntity(categories[4]),
                            CategoryModelMapper.toEntity(categories[2]),
                        ],
                        total: 5,
                        current_page: 2,
                        per_page: 2,
                        sort: 'name',
                        sort_dir: 'asc',
                        filter: null,
                    }),
                },
            ]

            for (const i of arrange) {
                const result = await repository.search(i.params)
                expect(result.toJSON()).toMatchObject(i.result.toJSON(true))
            }
        })

        describe('should search using all properties', () => {
            const defaultProps = {
                description: null,
                is_active: true,
                created_at: new Date(),
            }

            const categoriesProps = [
                {
                    id: chance.guid({ version: 4 }),
                    name: 'Test',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'd',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'Fake',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'b',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'ok',
                    ...defaultProps,
                },
                {
                    id: chance.guid({ version: 4 }),
                    name: 'TeSt',
                    ...defaultProps,
                },
            ]

            const arrange = [
                {
                    params: new CategoryRepository.SearchParams({
                        sort: 'name',
                        sort_dir: 'asc',
                        per_page: 2,
                        page: 1,
                        filter: 'b',
                    }),
                    params_result: new CategoryRepository.SearchResult({
                        items: [new Category(categoriesProps[3])],
                        total: 1,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: 'b',
                        sort_dir: 'asc',
                    }),
                },
                {
                    params: new CategoryRepository.SearchParams({
                        sort: 'name',
                        sort_dir: 'asc',
                        per_page: 2,
                        page: 1,
                        filter: 'test',
                    }),
                    params_result: new CategoryRepository.SearchResult({
                        items: [
                            new Category(categoriesProps[5]),
                            new Category(categoriesProps[0]),
                        ],
                        total: 2,
                        current_page: 1,
                        per_page: 2,
                        sort: 'name',
                        filter: 'test',
                        sort_dir: 'asc',
                    }),
                },
            ]
            beforeEach(async () => {
                await CategoryModel.bulkCreate(categoriesProps)
            })

            test.each(arrange)(
                'when value is %j',
                async ({ params, params_result }) => {
                    const result = await repository.search(params)
                    expect(result.toJSON()).toMatchObject(
                        params_result.toJSON(true),
                    )
                },
            )
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
