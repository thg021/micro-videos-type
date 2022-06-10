import ValidatorError from '../../../@seedwork/errors/validator-error'
import { Category } from './category'

describe('Category Integration Tests', () => {
  describe('create method', () => {
    it('should a invalid category when create using property name', () => {
      expect(() => new Category({ name: null })).toThrow(
        new ValidatorError('The name is required!'),
      )

      expect(() => new Category({ name: '' })).toThrow(
        new ValidatorError('The name is required!'),
      )

      expect(() => new Category({ name: 5 as any })).toThrow(
        new ValidatorError('The name must be a string!'),
      )

      expect(() => new Category({ name: 't'.repeat(256) })).toThrow(
        new ValidatorError(
          'The name must be less or equal than 255 characters!',
        ),
      )
    })

    it('should a invalid category when create using property description', () => {
      expect(
        () => new Category({ name: 'test', description: 1 as any }),
      ).toThrow(new ValidatorError('The description must be a string!'))

      expect(
        () => new Category({ name: 'test', description: true as any }),
      ).toThrow(new ValidatorError('The description must be a string!'))
    })

    it('should a invalid category when create using property is_active', () => {
      expect(() => new Category({ name: 'test', is_active: 1 as any })).toThrow(
        new ValidatorError('The is_active must be a boolean!'),
      )

      expect(
        () => new Category({ name: 'test', is_active: 'true' as any }),
      ).toThrow(new ValidatorError('The is_active must be a boolean!'))
    })
  })
})
