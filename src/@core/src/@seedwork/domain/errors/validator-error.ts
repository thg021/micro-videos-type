import { FieldsErrors } from '../validator/validator-fields-interface'

export class ValidatorError extends Error {}

export class EntityValidationError extends Error {
    constructor(public error: FieldsErrors) {
        super('Entity Validation error')
        this.name = 'EntityValidationError'
    }
}
