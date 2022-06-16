import ClassValidatorFields from '../validator/class-validator-fields'
import { FieldsErrors } from '../validator/validator-fields-interface'
import { EntityValidationError } from '../errors/validator-error'

type Expected = {
  validator: ClassValidatorFields<any>
  data: any | (() => any)
}

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === 'function') {
      try {
        //@ts-ignore
        expected()
        return isValid()
      } catch (e) {
        const error = e as EntityValidationError
        return assertContainsErrorMessages(error.error, received)
      }
    } else {
      const { validator, data } = expected
      const validated = validator.validate(data)

      if (validated) {
        return isValid()
      }

      return assertContainsErrorMessages(validator.errors, received)
    }
  },
})

function isValid() {
  return { pass: true, message: () => '' }
}

function assertContainsErrorMessages(
  expected: FieldsErrors,
  received: FieldsErrors,
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)
  return isMatch
    ? { pass: true, message: () => '' }
    : {
        pass: false,
        message: () =>
          `Then validation errors not contains ${JSON.stringify(
            received,
          )}. Current: ${JSON.stringify(expected)}`,
      }
}
