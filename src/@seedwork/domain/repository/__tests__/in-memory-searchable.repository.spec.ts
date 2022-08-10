import Entity from '../../entity/entity'
import { InMemorySearchableRepository } from '../in-memory-repository'
import { SearchParams, SearchResult } from '../repository-contracts'

type StubEntityProps = {
    name: string
    price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
    sortableFields: string[] = ['name']

    protected async applyFilter(
        items: StubEntity[],
        filter: string,
    ): Promise<StubEntity[]> {
        if (!filter) {
            return items
        }

        return items.filter((i) => {
            return (
                i.props.name
                    .toLowerCase()
                    .includes(filter.toLocaleLowerCase()) ||
                i.props.price.toString() === filter
            )
        })
    }
}

describe('InMemorySearchableRepository Unit Tests', () => {
    let repository: StubInMemorySearchableRepository

    //rodar antes de cada teste
    beforeEach(() => (repository = new StubInMemorySearchableRepository()))
    describe('applyFilter method', () => {
        it('should no filter items when filter param is null ', async () => {
            const items = [new StubEntity({ name: 'name value', price: 5 })]
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            const itensFiltered = await repository['applyFilter'](items, null)

            expect(itensFiltered).toStrictEqual(items)
            expect(spyFilterMethod).not.toHaveBeenCalled()
        })

        it('should  filter using a filter param', async () => {
            const items = [
                new StubEntity({ name: 'test', price: 5 }),
                new StubEntity({ name: 'TEST', price: 5 }),
                new StubEntity({ name: 'FAke', price: 0 }),
            ]
            const spyFilterMethod = jest.spyOn(items, 'filter' as any)
            let itensFiltered = await repository['applyFilter'](items, 'test')

            expect(itensFiltered).toStrictEqual([items[0], items[1]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(1)

            itensFiltered = await repository['applyFilter'](items, '5')

            expect(itensFiltered).toStrictEqual([items[0], items[1]])
            expect(spyFilterMethod).toHaveBeenCalledTimes(2)

            itensFiltered = await repository['applyFilter'](items, 'any')

            expect(itensFiltered).toHaveLength(0)
            expect(spyFilterMethod).toHaveBeenCalledTimes(3)
        })
    })

    describe('applySort method', () => {
        it('should no sort item', async () => {
            const items = [
                new StubEntity({ name: 'a', price: 5 }),
                new StubEntity({ name: 'c', price: 5 }),
                new StubEntity({ name: 'b', price: 5 }),
            ]
            let itemsFiltered = await repository['applySort'](items, null, null)
            expect(itemsFiltered).toStrictEqual(items)

            itemsFiltered = await repository['applySort'](items, 'price', null)
            expect(itemsFiltered).toStrictEqual(items)
        })

        it('should sort items', async () => {
            const items = [
                new StubEntity({ name: 'a', price: 5 }),
                new StubEntity({ name: 'c', price: 5 }),
                new StubEntity({ name: 'b', price: 5 }),
            ]

            let itemsFiltered = await repository['applySort'](
                items,
                'name',
                'asc',
            )
            expect(itemsFiltered).toStrictEqual([items[0], items[2], items[1]])

            itemsFiltered = await repository['applySort'](items, 'name', 'desc')
            expect(itemsFiltered).toStrictEqual([items[1], items[2], items[0]])
        })
    })

    describe('applyPaginate method', () => {
        it('should paginate items', async () => {
            const items = [
                new StubEntity({ name: 'a', price: 3 }),
                new StubEntity({ name: 'b', price: 3 }),
                new StubEntity({ name: 'c', price: 3 }),
                new StubEntity({ name: 'd', price: 3 }),
                new StubEntity({ name: 'e', price: 3 }),
                new StubEntity({ name: 'f', price: 3 }),
                new StubEntity({ name: 'g', price: 3 }),
            ]

            let itemsPaginated = await repository['applyPaginate'](items, 1, 2)
            expect(itemsPaginated).toStrictEqual([items[0], items[1]])

            itemsPaginated = await repository['applyPaginate'](items, 2, 2)
            expect(itemsPaginated).toStrictEqual([items[2], items[3]])

            itemsPaginated = await repository['applyPaginate'](items, 4, 2)
            expect(itemsPaginated).toStrictEqual([items[6]])

            itemsPaginated = await repository['applyPaginate'](items, 7, 2)
            expect(itemsPaginated).toStrictEqual([])
        })
    })

    describe('search method', () => {
        it('should apply only paginate when order params are null', async () => {
            const entity = new StubEntity({ name: 'test', price: 5 })
            const items = Array(16).fill(entity)
            repository.items = items

            const result = await repository.search(new SearchParams())

            expect(result).toStrictEqual(
                new SearchResult({
                    items: Array(15).fill(entity),
                    total: 16,
                    current_page: 1,
                    per_page: 15,
                    sort: null,
                    filter: null,
                    sort_dir: null,
                }),
            )
        })
    })
})
