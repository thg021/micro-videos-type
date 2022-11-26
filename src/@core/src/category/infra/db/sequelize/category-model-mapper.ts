import { Category } from '#category/domain'
import { EntityValidationError } from '#seedwork/domain'
import { LoadEntityError } from '#seedwork/domain/errors/load-entity.error'
import UniqueEntityId from '#seedwork/domain/value-objects/unique-entity-id.vo'
import { CategoryModel } from './category-model'

export class CategoryModelMapper {
    static toEntity(model: CategoryModel): Category {
        const { id, ...orderData } = model.toJSON()
        try {
            return new Category(orderData, new UniqueEntityId(id))
        } catch (e) {
            if (e instanceof EntityValidationError) {
                throw new LoadEntityError(e.error)
            }

            throw e
        }
    }
}
