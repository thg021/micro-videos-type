import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from './category-model'

describe('CategoryModel unit test', () => {
    let sequelize: Sequelize

    beforeAll(() => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            host: ':memory:',
            logging: false,
            models: [CategoryModel],
        })
    })

    beforeEach(async () => {
        await sequelize.sync({
            force: true,
        })
    })

    afterEach(async () => {
        await sequelize.close()
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
