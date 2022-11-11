import { Category } from '../../../domain/entities/category'
import { InMemorySearchableRepository } from '../../../../@seedwork/domain/repository/in-memory-repository'
import CategoryRepository from '../../../domain/repository/category.repository'
import { SortDirection } from '../../../../@seedwork/domain/repository/repository-contracts'

export class CategoryInMemoryRepository
    extends InMemorySearchableRepository<Category>
    implements CategoryRepository.IRepository
{
    sortableFields: string[] = ['name', 'created_at']

    protected async applyFilter(
        items: Category[],
        filter: CategoryRepository.Filter,
    ): Promise<Category[]> {
        if (!filter) {
            return items
        }

        return items.filter((i) => {
            return i.props.name
                .toLowerCase()
                .includes(filter.toLocaleLowerCase())
        })
    }

    protected async applySort(
        items: Category[],
        sort: string,
        sort_dir: SortDirection,
    ): Promise<Category[]> {
        return !sort
            ? super.applySort(items, 'created_at', 'desc')
            : super.applySort(items, sort, sort_dir)
    }
}
