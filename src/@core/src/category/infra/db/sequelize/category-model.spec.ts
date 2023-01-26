import { setupSequelize } from '#seedwork/infra/testing/helpers/db'
import { DataType } from 'sequelize-typescript'
import { CategorySequelize } from './category-sequelize'

const { CategoryModel } = CategorySequelize

describe('CategoryModel unit test', () => {
    setupSequelize({ models: [CategoryModel] })
    test('mapping properties', async () => {
        const atributesMap = CategoryModel.getAttributes()
        const attributes = Object.keys(atributesMap)
        expect(attributes).toStrictEqual([
            'id',
            'name',
            'description',
            'is_active',
            'created_at',
        ])

        const idAttr = atributesMap.id
        expect(idAttr).toMatchObject({
            field: 'id',
            fieldName: 'id',
            primaryKey: true,
            type: DataType.UUID(),
        })

        const nameAttr = atributesMap.name
        expect(nameAttr).toMatchObject({
            field: 'name',
            fieldName: 'name',
            type: DataType.STRING(255),
        })

        const descriptionAttr = atributesMap.description
        expect(descriptionAttr).toMatchObject({
            field: 'description',
            fieldName: 'description',
            type: DataType.TEXT(),
        })

        const isActiveAttr = atributesMap.is_active
        expect(isActiveAttr).toMatchObject({
            field: 'is_active',
            fieldName: 'is_active',
            type: DataType.BOOLEAN(),
            allowNull: false,
        })

        const createdAtAttr = atributesMap.created_at
        expect(createdAtAttr).toMatchObject({
            field: 'created_at',
            fieldName: 'created_at',
            type: DataType.DATE(),
            allowNull: false,
        })
    })

    it('should be create', async () => {
        const arrange = {
            id: '13413155-bd02-456e-99c6-fd70cd16074f',
            name: 'Movie',
            description: 'Movie description',
            is_active: true,
            created_at: new Date(),
        }

        const category = await CategoryModel.create(arrange)

        // este category é um activeRecord. Tem varias coisas aqui
        // convertemos para JSON para pegar somente aquilo que precisamos
        // console.log(category.toJSON())
        expect(category.toJSON()).toStrictEqual(arrange)
    })
})
