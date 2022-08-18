import { Category } from '../../../../category/domain/entities/category'
import NotFoundError from '../../../../@seedwork/domain/errors/not-found-error'
import CategoryInMemoryRepository from '../../../../category/infra/repository/category-in-memory.repository'
import UpdateCategoryUseCase from '../update-category.use-case'

describe('UpdateCategoryUseCase Unit Tests', () => {
    let repository: CategoryInMemoryRepository
    let useCase: UpdateCategoryUseCase
    beforeEach(() => {
        repository = new CategoryInMemoryRepository()
        useCase = new UpdateCategoryUseCase(repository)
    })

    it('should throws error when entity not found', async () => {
        expect(() =>
            useCase.execute({ id: 'fake id', name: 'fake name' }),
        ).rejects.toThrowError(
            new NotFoundError(`Entity Not Found using ID fake id`),
        )
    })

    it('should update category', async () => {
        const spyUpdate = jest.spyOn(repository, 'update')
        const entity = new Category({ name: 'Movie' })
        repository.items = [entity]

        let output = await useCase.execute({ id: entity.id, name: 'Cartoon' })
        expect(spyUpdate).toHaveBeenCalledTimes(1)
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
