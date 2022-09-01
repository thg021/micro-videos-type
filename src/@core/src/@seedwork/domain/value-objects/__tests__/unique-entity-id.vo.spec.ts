import InvalidUuidError from '../../errors/invalid-uuid.error'
import UniqueEntityId from '../unique-entity-id.vo'
import { validate as uuidValidate } from 'uuid'

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, 'validate')
}
describe('UniqueEntityId Unit tests', () => {
  it('should throw error when uuid is invalid', () => {
    const validateSpy = spyValidateMethod()
    expect(() => new UniqueEntityId('fake id').value).toThrow(
      new InvalidUuidError(),
    )
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const validateSpy = spyValidateMethod()
    const uuid = '291f3061-0549-4135-b79d-63017215fdab'
    const vo = new UniqueEntityId('291f3061-0549-4135-b79d-63017215fdab').value
    expect(vo).toBe(uuid)
    expect(validateSpy).toHaveBeenCalled()
  })

  it('should accept a uuid passed in constructor', () => {
    const validateSpy = spyValidateMethod()
    const vo = new UniqueEntityId().value
    expect(uuidValidate(vo)).toBeTruthy()
    expect(validateSpy).toHaveBeenCalled()
  })
})
