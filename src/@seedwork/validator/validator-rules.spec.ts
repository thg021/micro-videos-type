import ValidatorError from '../errors/validator-error'
import ValidatorRules from './validator-rules'

type Values = {
  value: any
  property: string
}

type ExpectedRule = {
  value: any
  property: string
  rule: keyof ValidatorRules
  error: ValidatorError
  params?: any[]
}

enum MessageError {
  Required = 'The field is required!',
  String = 'The field must be a string!',
  Boolean = 'The field must be a boolean!',
}

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).toThrow(expected.error)
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected)
  }).not.toThrow(expected.error)
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, 'error'>) {
  const validator = ValidatorRules.values(value, property)
  const method = validator[rule] as (...args: any[]) => ValidatorRules
  method.apply(validator, params)
}

describe('Validator Rules Unit Test', () => {
  test('value method', () => {
    const validator = ValidatorRules.values('some value', 'field')
    expect(validator).toBeInstanceOf(ValidatorRules)
    expect(validator['value']).toBe('some value')
    expect(validator['property']).toBe('field')
  })

  test('required validation rules  ', () => {
    let arrange: Values[] = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: '', property: 'field' },
    ]

    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error: new ValidatorError(MessageError.Required),
      })
    })

    arrange = [
      { value: 1, property: 'field' },
      { value: 2, property: 'field' },
      { value: 'test', property: 'field' },
      { value: true, property: 'field' },
      { value: false, property: 'field' },
    ]

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'required',
        error: new ValidatorError(MessageError.Required),
      })
    })
  })

  test('string validation rules  ', () => {
    let arrange: Values[] = [
      { value: 1, property: 'field' },
      { value: {}, property: 'field' },
      { value: true, property: 'field' },
      { value: [], property: 'field' },
    ]
    const error = new ValidatorError(MessageError.String)
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      })
    })

    arrange = [
      { value: null, property: 'field' },
      { value: undefined, property: 'field' },
      { value: 'test', property: 'field' },
    ]

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'string',
        error,
      })
    })
  })

  test('maxLength validation rules  ', () => {
    let arrange: Values[] = [{ value: 'aaaaa', property: 'field' }]
    const error = new ValidatorError(
      'The field must be less or equal than 4 characters!',
    )
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [4],
      })
    })

    arrange = [{ value: 'aaaaa', property: 'field' }]

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'maxLength',
        error,
        params: [5],
      })
    })
  })

  test('boolean validation rules  ', () => {
    let arrange: Values[] = [
      { value: 'aaaaa', property: 'field' },
      { value: 1, property: 'field' },
      { value: [], property: 'field' },
      { value: {}, property: 'field' },
    ]
    const error = new ValidatorError(MessageError.Boolean)
    arrange.forEach((item) => {
      assertIsInvalid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
      })
    })

    arrange = [
      { value: true, property: 'field' },
      { value: false, property: 'field' },
      { value: undefined, property: 'field' },
      { value: null, property: 'field' },
    ]

    arrange.forEach((item) => {
      assertIsValid({
        value: item.value,
        property: item.property,
        rule: 'boolean',
        error,
      })
    })
  })

  it('should throw a validation error when combine two or more validation rules', () => {
    let validator = ValidatorRules.values(null, 'field')
    expect(() => {
      validator.required().string()
    }).toThrow(new ValidatorError(MessageError.Required))

    validator = ValidatorRules.values(5, 'field')
    expect(() => {
      validator.required().string()
    }).toThrow(new ValidatorError(MessageError.String))

    validator = ValidatorRules.values('aaaaaa', 'field')
    expect(() => {
      validator.required().string().maxLength(5)
    }).toThrow(
      new ValidatorError('The field must be less or equal than 5 characters!'),
    )

    validator = ValidatorRules.values(null, 'field')
    expect(() => {
      validator.required().boolean()
    }).toThrow(new ValidatorError(MessageError.Required))

    validator = ValidatorRules.values('true', 'field')
    expect(() => {
      validator.required().boolean()
    }).toThrow(new ValidatorError(MessageError.Boolean))
  })

  it('should a valid when combine two or more validation rules', () => {
    expect.assertions(0)
    ValidatorRules.values('teste', 'field').required().string()
    ValidatorRules.values('aaaaa', 'field').required().string().maxLength(5)

    ValidatorRules.values(true, 'field').required().boolean()
    ValidatorRules.values(false, 'field').required().boolean()
  })
})
