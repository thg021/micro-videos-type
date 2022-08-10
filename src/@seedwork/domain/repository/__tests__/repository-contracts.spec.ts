import {SearchParams, SearchResult} from '../repository-contracts'

describe('Search Unit Tests', () => {
  describe('SearchParams Unit tests', () => {
    test('page props', () => {
      const arrange = [
        {
          page: '',
          expect: 1
        },
        {
          page: null,
          expect: 1
        },
        {
          page: undefined,
          expect: 1
        },
        {
          page: true,
          expect: 1
        }, {
          page: 'fake',
          expect: 1
        }, {
          page: 3.1,
          expect: 1
        }, {
          page: -1,
          expect: 1
        }, {
          page: 1,
          expect: 1
        }, {
          page: 99,
          expect: 99
        },
      ] as any

      const params = new SearchParams()
      expect(params.page).toBe(1)

      arrange.forEach((item) => {
        const {page} = item
        const params = new SearchParams({page})
        expect(params.page).toBe(item.expect)
      })
    })

    test('per page props', () => {
      const arrange = [
        {
          per_page: '',
          expect: 15
        },
        {
          per_page: null,
          expect: 15
        },
        {
          per_page: undefined,
          expect: 15
        },
        {
          per_page: true,
          expect: 15
        }, {
          per_page: false,
          expect: 15
        }, {
          per_page: 'fake',
          expect: 15
        }, {
          per_page: 3.15,
          expect: 15
        }, {
          per_page: -1,
          expect: 15
        }, {
          per_page: 1,
          expect: 1
        }, {
          per_page: 99,
          expect: 99
        },
      ] as any

      const params = new SearchParams()
      expect(params.per_page).toBe(15)

      arrange.forEach((item) => {
        const {per_page} = item
        const params = new SearchParams({per_page})
        expect(params.per_page).toBe(item.expect)
      })
    })

    test('sort props', () => {
      const params = new SearchParams()
      expect(params.sort).toBeNull()

      const arrange = [
        {
          sort: '',
          expect: null
        },
        {
          sort: null,
          expect: null
        },
        {
          sort: undefined,
          expect: null
        },
        {
          sort: true,
          expect: 'true'
        }, {
          sort: false,
          expect: 'false'
        }, {
          sort: 'fake',
          expect: 'fake'
        }, {
          sort: 3,
          expect: '3'
        }, {
          sort: -1,
          expect: '-1'
        }, {
          sort: 1,
          expect: '1'
        }, {
          sort: {},
          expect: '[object Object]'
        },
      ] as any

      arrange.forEach((item) => {
        const {sort} = item
        const params = new SearchParams({sort})
        expect(params.sort).toBe(item.expect)
      })
    })

    test('sort dir props', () => {
      const params = new SearchParams()
      expect(params.sort_dir).toBeNull()

      const arrange = [
        {
          sort: '',
          expect: null
        },
        {
          sort: null,
          expect: null
        },
        {
          sort: undefined,
          expect: null
        },
        {
          sort: 'field',
          expect: 'asc'
        }, {
          sort: true,
          expect: 'asc'
        }, {
          sort: false,
          expect: 'asc'
        }, {
          sort: {},
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: null,
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: undefined,
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: '',
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: {},
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: [],
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: 'asc',
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: 'desc',
          expect: 'desc'
        }, {
          sort: 'field',
          sort_dir: 'faker',
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: 'FAKER',
          expect: 'asc'
        }, {
          sort: 'field',
          sort_dir: 'DESC',
          expect: 'desc'
        },
      ] as any

      arrange.forEach(item => {
        const params = new SearchParams(item)
        expect(params.sort_dir).toBe(item.expect)
      })
    })

    test('filter props', () => {
      const arrange = [
        {
          filter: '',
          expect: null
        },
        {
          filter: null,
          expect: null
        },
        {
          filter: undefined,
          expect: null
        },
        {
          filter: true,
          expect: 'true'
        }, {
          filter: false,
          expect: 'false'
        }, {
          filter: 'fake',
          expect: 'fake'
        }, {
          filter: 3.15,
          expect: '3.15'
        }, {
          filter: -1,
          expect: '-1'
        }, {
          filter: 1,
          expect: '1'
        }, {
          filter: 99,
          expect: '99'
        },
      ] as any

      const params = new SearchParams()
      expect(params.filter).toBeNull()

      arrange.forEach((item) => {
        const {filter} = item
        const params = new SearchParams({filter})
        expect(params.filter).toBe(item.expect)
      })
    })
  })

  describe('SearchResult Unit tests', () => {
    test('constructor props', () => {
      let result = new SearchResult({
        items: ['entity1', 'entity2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      })

      expect(result.toJSON()).toStrictEqual({
        items: ['entity1', 'entity2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        last_page: 2,
        sort: null,
        sort_dir: null,
        filter: null
      })

      result = new SearchResult({
        items: ['entity1', 'entity2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      })

      expect(result.toJSON()).toStrictEqual({
        items: ['entity1', 'entity2'] as any,
        total: 4,
        current_page: 1,
        per_page: 2,
        last_page: 2,
        sort: 'name',
        sort_dir: 'asc',
        filter: 'test'
      })
    })

    it('should set last_page = 1  when per_page field is greater than total field', () => {
      let result = new SearchResult({
        items: [] as any,
        total: 4,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      })
      expect(result.last_page).toBe(1)
    })

    test('last page props when total is a not multiple of per_page', () => {
      let result = new SearchResult({
        items: [] as any,
        total: 101,
        current_page: 1,
        per_page: 20,
        sort: null,
        sort_dir: null,
        filter: null
      })
      expect(result.last_page).toBe(6)
    })
  })
});
