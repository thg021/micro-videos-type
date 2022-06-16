import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from './category.validator'
describe('CategoryValidator tests', () => {
  let validator: CategoryValidator

  beforeEach(() => (validator = CategoryValidatorFactory.create()))
  test('invalidation cases for name field', () => {
    let isValid = validator.validate(null)
    expect(isValid).toBeFalsy()
    expect(validator.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ])

    isValid = validator.validate({ name: '' })
    expect(isValid).toBeFalsy()
    expect(validator.errors['name']).toStrictEqual(['name should not be empty'])

    isValid = validator.validate({ name: 5 as any })
    expect(isValid).toBeFalsy()
    expect(validator.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ])

    isValid = validator.validate({ name: 'a'.repeat(256) })
    expect(isValid).toBeFalsy()
    expect(validator.errors['name']).toStrictEqual([
      'name must be shorter than or equal to 255 characters',
    ])
  })

  test('validation cases for name field', () => {
    const created_at = new Date()

    const arrange = [
      { name: 'some text' },
      { name: 'some text', description: null },
      { name: 'some text', description: undefined },
      {
        name: 'some text',
        description: 'some description',
      },
      { name: 'some text', is_active: true },
      { name: 'some text', is_active: false },
      { name: 'some text', is_active: false },
      { name: 'some text', created_at },
      {
        name: 'some text',
        description: 'some description',
        is_active: true,
      },
    ]

    arrange.forEach((item) => {
      const isValid = validator.validate(item)
      expect(isValid).toBeTruthy()
      expect(validator.validateDate).toStrictEqual(new CategoryRules(item))
    })
  })
})
