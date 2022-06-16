import { Category } from '../category'

describe('Category Integration Tests', () => {
  describe('create method', () => {
    it('should a invalid category when create using property name', () => {
      expect(() => new Category({ name: null })).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => new Category({ name: '' })).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() => new Category({ name: 5 as any })).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(
        () => new Category({ name: 't'.repeat(256) }),
      ).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a invalid category when create using property description', () => {
      expect(
        () => new Category({ name: 'test', description: 1 as any }),
      ).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    it('should a invalid category when create using property is_active', () => {
      expect(
        () => new Category({ name: 'test', is_active: 1 as any }),
      ).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      })
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
      expect(() => category.update(null)).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => category.update('')).containsErrorMessages({
        name: ['name should not be empty'],
      })

      expect(() => category.update(2 as any)).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      })

      expect(() => category.update('t'.repeat(256))).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      })
    })

    it('should a throw update when create using invalid property description', () => {
      let category = new Category({ name: 'Movie' })
      expect(() => category.update('test', 1 as any)).containsErrorMessages({
        description: ['description must be a string'],
      })

      expect(() => category.update('test', true as any)).containsErrorMessages({
        description: ['description must be a string'],
      })
    })

    it('should a valid update', () => {
      expect.assertions(0)
      const category = new Category({ name: 'Movie' })
      category.update('t'.repeat(255))
      category.update('Movie', 'Other description')
    })
  })
})
