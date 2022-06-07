import ValidatorError from "../errors/validator-error";
import ValidatorRules from "./validator-rules";

type Values = {
  value: any;
  property: string;
}

type ExpectedRule = {
  value: any; 
  property: string;
  rule: keyof ValidatorRules;
  error: ValidatorError;
  params?: any[]
}

function assertIsInvalid({ value, property, rule, error, params = [] }: ExpectedRule){
  expect(() => {
  const validator = ValidatorRules.values(value, property)
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params)
  }).toThrow(error)
}

function assertIsValid({ value, property, rule, error, params = [] }: ExpectedRule){
  expect(() => {
    const validator = ValidatorRules.values(value, property)
    const method = validator[rule] as (...args: any[]) => ValidatorRules;
    method.apply(validator, params)
  }).not.toThrow(error)
}

describe('Validator Rules Unit Test', () => {
  test('value method', () => {
    const validator = ValidatorRules.values('some value', 'field')
    expect(validator).toBeInstanceOf(ValidatorRules)
    expect(validator['value']).toBe('some value')
    expect(validator['property']).toBe('field')
  });

  test('required validation rules  ', () => {

    let arrange:Values[] = [
      {value: null, property: 'field'}, 
      {value: undefined, property: 'field'},
      {value: "", property: 'field'}
    ]

    arrange.forEach(item => {
      assertIsInvalid({ value: item.value,property:  item.property,rule: 'require', error: new ValidatorError('The field is required!')})
    });

    arrange = [
      {value: 1, property: 'field'}, 
      {value: 2, property: 'field'},
      {value: "test", property: 'field'},
      {value: true, property: 'field'},
      {value: false, property: 'field'},
    ]

    arrange.forEach(item => {
      assertIsValid({ value: item.value,property:  item.property, rule: 'require', error: new ValidatorError('The field is required!')})
    })
  });

  
  test('string validation rules  ', () => {

    let arrange:Values[] = [
      {value: 1, property: 'field'}, 
      {value: {}, property: 'field'},
      {value: true, property: 'field'}, 
      {value: [], property: 'field'}, 
      {value: null, property: 'field'}, 
      {value: undefined, property: 'field'}, 
    ]
    const error = new ValidatorError('The field must be a string!')
    arrange.forEach(item => {
      assertIsInvalid({ 
        value: item.value,
        property:  item.property,
        rule: 'string', 
        error
      })
    });

    arrange = [
      {value: "test", property: 'field'},
    ]

    arrange.forEach(item => {
      assertIsValid({ 
        value: item.value,
        property:  item.property, 
        rule: 'string', 
        error
      })
    });

  })

  test('maxLenght validation rules  ', () => {

    let arrange:Values[] = [
      {value: "aaaaa", property: 'field'}, 
    ]
    const error = new ValidatorError('The field must be less or equal than 4 characters!')
    arrange.forEach(item => {
      assertIsInvalid({ 
        value: item.value,
        property:  item.property,
        rule: 'maxLength', 
        error, 
        params: [4]
      })
    });

    arrange = [
      {value: "aaaaa", property: 'field'},
    ]

    arrange.forEach(item => {
      assertIsValid({ 
        value: item.value,
        property:  item.property, 
        rule: 'maxLength', 
        error, 
        params: [5]
      })
    });
  });
});