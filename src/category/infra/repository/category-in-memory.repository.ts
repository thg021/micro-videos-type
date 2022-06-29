import { Category } from '../../domain/entities/category'
import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from '../../../@seedwork/domain/repository/in-memory-repository'
import CategoryRepository from '../../domain/repository/category.repository'

export default class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository {}
