import CategoryValidatorFactory, {
  CategoryRules,
  CategoryValidator,
} from './category.validator'
describe('CategoryValidator tests', () => {
  let validator: CategoryValidator

  beforeEach(() => (validator = CategoryValidatorFactory.create()))
  test('invalidation cases for name field', () => {
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect({ validator, data: { name: '' } }).containsErrorMessages({
      name: ['name should not be empty'],
    })

    expect({ validator, data: { name: 5 as any } }).containsErrorMessages({
      name: [
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
    })

    expect({
      validator,
      data: { name: 'a'.repeat(256) },
    }).containsErrorMessages({
      name: ['name must be shorter than or equal to 255 characters'],
    })
  })

  test('invalidation cases for description field', () => {
    expect({
      validator,
      data: { name: 'test', description: 1 },
    }).containsErrorMessages({
      description: ['description must be a string'],
    })
  })

  test('invalidation cases for is_active field', () => {
    expect({
      validator,
      data: { name: 'test', is_active: 1 },
    }).containsErrorMessages({
      is_active: ['is_active must be a boolean value'],
    })
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
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
    })
  })
})
