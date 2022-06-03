import InvalidUuidError from '../../../@seedwork/errors/invalid-uuid.error'
import { v4 as uuidV4, validate as uuidValidate} from 'uuid'
import ValueObject from './value-object'

export default class UniqueEntityId extends ValueObject<string>{
  constructor(readonly id?: string){
    super(id || uuidV4())
    this.validate()
  }

  private validate() {
    const isValid = uuidValidate(this.id)
    if(!isValid){
      throw new InvalidUuidError()
    }
  }
}
