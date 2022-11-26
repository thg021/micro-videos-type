import { Category } from '#category/domain'
import { LoadEntityError } from '#seedwork/domain/errors/load-entity.error'
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo'
import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import { CategoryModel } from './category-model'
import { CategoryModelMapper } from './category-model-mapper'

describe('CategoryModelMapper unit test', () => {
    setupSequelize({ models: [CategoryModel] })

    it('should throws error when category is not valid', async () => {
        const model = CategoryModel.build({
            id: '3c360c71-744e-4849-b2f6-09c2ba20a0aa',
        })
        try {
            CategoryModelMapper.toEntity(model)
            fail(
                'The category is valid, but it needs throws a LoadEntityError exception',
            )
        } catch (e) {
            expect(e).toBeInstanceOf(LoadEntityError)
            expect(e.error).toMatchObject({
                name: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters',
                ],
            })
        }
    })

    it('should throws generic error', async () => {
        const error = new Error('Generic error')
        const spyCategory = jest
            .spyOn(Category, 'validate')
            .mockImplementation(() => {
                throw error
            })
        const model = CategoryModel.build({
            id: '3c360c71-744e-4849-b2f6-09c2ba20a0aa',
        })
        expect(() => CategoryModelMapper.toEntity(model)).toThrow(error)
        expect(spyCategory).toHaveBeenCalled()
        spyCategory.mockRestore()
    })

    it('should convert a category model to a category entity', () => {
        const created_at = new Date()
        const model = CategoryModel.build({
            id: '3c360c71-744e-4849-b2f6-09c2ba20a0aa',
            name: 'Test category',
            description: 'description',
            is_active: true,
            created_at,
        })

        const entity = CategoryModelMapper.toEntity(model)
        expect(entity.toJSON()).toStrictEqual(
            new Category(
                {
                    name: 'Test category',
                    description: 'description',
                    created_at,
                    is_active: true,
                },
                new UniqueEntityId('3c360c71-744e-4849-b2f6-09c2ba20a0aa'),
            ).toJSON(),
        )
    })
})
