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

    it('should a valid category', () => {
      expect.assertions(0)
      new Category({ name: 'Movie' })
      new Category({ name: 'Movie', description: 'some description' })
      new Category({ name: 'Movie', description: null })
      new Category({
        name: 'Movie',
        description: 'some description',
        is_active: true,
      })
      new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
      })
    })
  })

  describe('update method', () => {
    it('should a throw update when create using invalid property name', () => {
      let category = new Category({ name: 'Movie' })
      expect(() => category.update(null)).toThrow(
        new ValidatorError('The name is required!'),
      )
      expect(() => category.update('')).toThrow(
        new ValidatorError('The name is required!'),
      )

      expect(() => category.update(2 as any)).toThrow(
        new ValidatorError('The name must be a string!'),
      )

      expect(() => category.update('t'.repeat(256))).toThrow(
        new ValidatorError(
          'The name must be less or equal than 255 characters!',
        ),
      )
    })

    it('should a throw update when create using invalid property description', () => {
      let category = new Category({ name: 'Movie' })
      expect(() => category.update('test', 1 as any)).toThrow(
        new ValidatorError('The description must be a string!'),
      )

      expect(() => category.update('test', true as any)).toThrow(
        new ValidatorError('The description must be a string!'),
      )
    })

    it('should a valid update', () => {
      expect.assertions(0)
      const category = new Category({ name: 'Movie' })
      category.update('t'.repeat(255))
      category.update('Movie', 'Other description')
    })
  })
})
