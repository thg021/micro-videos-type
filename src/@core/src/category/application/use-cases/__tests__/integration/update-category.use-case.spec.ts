import { Category } from '../../../../../category/domain/entities/category'
import NotFoundError from '../../../../../@seedwork/domain/errors/not-found-error'
import { CategoryInMemoryRepository } from '#category/infra/db/in-memory'
import UpdateCategoryUseCase from '../../update-category.use-case'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import { CategorySequelize } from '#category/infra/db/sequelize/category-sequelize'

const { CategorySequelizeRepository, CategoryModel } = CategorySequelize

describe('UpdateCategoryUseCase Integration Tests', () => {
    let useCase: UpdateCategoryUseCase.UseCase
    let repository: CategorySequelize.CategorySequelizeRepository

    setupSequelize({ models: [CategoryModel] })

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel)
        useCase = new UpdateCategoryUseCase.UseCase(repository)
    })

    it('should throws error when entity not found', async () => {
        await expect(() =>
            useCase.execute({ id: 'fake id', name: 'fake name' }),
        ).rejects.toThrowError(
            new NotFoundError(`Entity Not Found using ID fake id`),
        )
    })

    it('should update category', async () => {
        const entity = await CategoryModel.factory().create()

        let output = await useCase.execute({ id: entity.id, name: 'Cartoon' })
        expect(output).toStrictEqual({
            id: entity.id,
            name: 'Cartoon',
            description: null,
            is_active: true,
            created_at: entity.created_at,
        })

        type Arrange = {
            input: {
                id: string
                name: string
                description?: null | string
                is_active?: boolean
            }
            expected: {
                id: string
                name: string
                description: null | string
                is_active: boolean
                created_at: Date
            }
        }

        const arrange: Arrange[] = [
            {
                input: {
                    id: entity.id,
                    name: 'test',
                    description: 'some description',
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test',
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: null,
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test',
                    is_active: false,
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: null,
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test',
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: null,
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test',
                    is_active: true,
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: null,
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                },
                expected: {
                    id: entity.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
        ]

        for (const i of arrange) {
            output = await useCase.execute({
                id: i.input.id,
                name: i.input.name,
                description: i.input.description,
                is_active: i.input.is_active,
            })

            expect(output).toStrictEqual({
                id: entity.id,
                name: i.expected.name,
                description: i.expected.description,
                is_active: i.expected.is_active,
                created_at: i.expected.created_at,
            })
        }
    })
})