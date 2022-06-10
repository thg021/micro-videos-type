import ValidatorError from '../../../@seedwork/errors/validator-error'
import { Category } from './category'

describe('Category Integration Tests', () => {
  it('should a invalid category when create', () => {
    expect(() => new Category({ name: null })).toThrow(
      new ValidatorError('The name is required!'),
    )
  })
})
