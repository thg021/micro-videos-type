import { Category } from '../../../domain/entities/category'
import { CategoryInMemoryRepository } from './category-in-memory.repository'

describe('Category in memory unit test', () => {
    let repository: CategoryInMemoryRepository
    const items = [
        new Category({
            name: 'b',
            created_at: new Date('2022-08-11T00:00:00'),
        }),
        new Category({
            name: 'test',
            created_at: new Date('2022-08-10T00:00:00'),
        }),
        new Category({
            name: 'a',
            created_at: new Date('2022-08-09T00:00:00'),
        }),

        new Category({
            name: 'c',
            created_at: new Date('2022-08-11T00:00:00'),
        }),
    ]

    beforeEach(() => (repository = new CategoryInMemoryRepository()))
    it('should return the list of items when filter is null ', async () => {
        repository.items = items
        const itemsFiltered = await repository['applyFilter'](items, null)
        expect(itemsFiltered).toStrictEqual(items)
    })

    it('should return the filtered items', async () => {
        repository.items = items
        const itemsFiltered = await repository['applyFilter'](items, 'TEST')
        expect(itemsFiltered).toStrictEqual([items[1]])
    })

    it('should sort by created_at field when params null', async () => {
        repository.items = items
        const itemsSorted = await repository['applySort'](items, null, null)
        expect(itemsSorted).toStrictEqual([
            items[0],
            items[3],
            items[1],
            items[2],
        ])
    })

    it('should sort the name property list', async () => {
        repository.items = items
        let itemsSorted = await repository['applySort'](items, 'name', null)
        expect(itemsSorted).toStrictEqual([
            items[1],
            items[3],
            items[0],
            items[2],
        ])

        itemsSorted = await repository['applySort'](items, 'name', 'asc')
        expect(itemsSorted).toStrictEqual([
            items[2],
            items[0],
            items[3],
            items[1],
        ])
    })
})
