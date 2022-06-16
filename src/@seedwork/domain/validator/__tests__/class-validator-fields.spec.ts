import ClassValidatorFields from '../class-validator-fields'
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields Unit Test', () => {
  it('should inialize error and validatedData variables with null', () => {
    const validator = new StubClassValidatorFields()
    expect(validator.errors).toBeNull()
    expect(validator.validateDate).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([
        { property: 'field', constraints: { isRequired: 'some error' } },
      ])
    const validator = new StubClassValidatorFields()

    expect(validator.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validateDate).toBeNull()
    expect(validator.errors).toStrictEqual({ field: ['some error'] })
  })

  it('should validate without errors', () => {
    const spyValidateSync = jest
      .spyOn(libClassValidator, 'validateSync')
      .mockReturnValue([])
    const validator = new StubClassValidatorFields()

    expect(validator.validate({ field: 'some value' })).toBeTruthy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(validator.validateDate).toStrictEqual({ field: 'some value' })
    expect(validator.errors).toBeNull()
  })
})
