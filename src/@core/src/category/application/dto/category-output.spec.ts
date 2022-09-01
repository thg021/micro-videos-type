import { Category } from '../../../category/domain/entities/category'
import { CategoryOutputMapper } from './category-output'

describe('CategoryOutputMapper unit test', () => {
    it('should convert a category in output', () => {
        const created_at = new Date()
        const entity = new Category({
            name: 'Movie',
            description: 'Some description',
            created_at,
            is_active: true,
        })

        const spyToJson = jest.spyOn(entity, 'toJSON')
        const output = CategoryOutputMapper.toOutput(entity)

        expect(spyToJson).toHaveBeenCalled()
        expect(output).toStrictEqual({
            id: entity.id,
            name: 'Movie',
            description: 'Some description',
            created_at,
            is_active: true,
        })
    })
})
