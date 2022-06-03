import UniqueEntityId from "../../../@seedwork/domain/unique-entity-id.vo"
import { Category } from './category';
import { omit } from 'lodash'
describe('Category Test', () => {
  test('constructor of category', () => {

    let category = new Category({ name: 'Movie' })
    let props = omit(category.props, 'created_at')
    // expect(category.name).toBe('Movie')
    // expect(category.description).toBe('description')
    // expect(category.is_active).toBeTruthy()
    // expect(category.created_at).toBe(created_at)

    //toMatchObject -> verificar parcialmente o objeto.
    expect(props).toMatchObject({
      name: 'Movie',
      description: null,
      is_active: true
    })
    expect(category.props.created_at).toBeInstanceOf(Date)

    let created_at = new Date()
    category = new Category({name: 'Movie', description: 'some description',created_at, is_active: false})
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at
    })

    category = new Category({name: 'Movie', description: 'other description'})
    expect(category.props).toMatchObject({
      name: 'Movie',
      description: 'other description'
    })

    category = new Category({name: 'Movie', is_active: true})
    expect(category.props).toMatchObject({
      name: 'Movie',
      is_active: true
    })

    created_at = new Date()
    category = new Category({name: 'Movie', created_at})
    expect(category.props).toMatchObject({
      name: 'Movie',
      created_at
    })

  });

  test('id field', () => {

    const data = [
      {props: {name: 'Movie'}},
      {props: {name: 'Movie'}, id: null},
      {props: {name: 'Movie'}, id: undefined},
      {props: {name: 'Movie'}, id: new UniqueEntityId('291f3061-0549-4135-b79d-63017215fdab')},
    ]

    data.forEach(item => {
      const category = new Category(item.props, item?.id)
      expect(category.id).not.toBeNull()
      expect(category.id).toBeInstanceOf(UniqueEntityId)
    })

  });
  test('getter of name field', () => {
    const category = new Category({name: 'Movie'})
    expect(category.name).toBe('Movie')
  });

  test('getter and setter of description field', () => {
    let category = new Category({name: 'Movie', description: 'Some description'})
    expect(category.description).toBe('Some description')

    category = new Category({name: 'Movie'})
    expect(category.description).toBeNull()

    category["description"] = undefined
    expect(category.description).toBeNull()
  });

  test('getter and setter of is_active field', () => {
    let category = new Category({name: 'Movie'})
    expect(category.is_active).toBeTruthy()

    category = new Category({name: 'Movie', is_active: true})
    expect(category.is_active).toBeTruthy()

    category = new Category({name: 'Movie', is_active: false})
    expect(category.is_active).toBeFalsy()
  });

  test('getter of created_at field', () => {
    const created_at = new Date()
    const category = new Category({name: 'Movie', created_at})
    expect(category.created_at).toBe(created_at)
    expect(category.created_at).toBeInstanceOf(Date)
  });
});

