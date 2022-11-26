import { SequelizeModelFactory } from './sequelize-model-factory'
import _chance from 'chance'
import {
    Column,
    DataType,
    Model,
    PrimaryKey,
    Sequelize,
    Table,
} from 'sequelize-typescript'
import { validate as uuidValidated } from 'uuid'
import { setupSequelize } from '../testing/helpers/db'

const chance = _chance()

@Table({})
class StubModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name

    static mockFactory = jest.fn(() => ({
        id: chance.guid({ version: 4 }),
        name: chance.word(),
    }))

    static factory() {
        return new SequelizeModelFactory(StubModel, StubModel.mockFactory)
    }
}

describe('SequelizeModelFactory unit tests', () => {
    setupSequelize({ models: [StubModel] })

    describe('Create Method', () => {
        it('should be able one register', async () => {
            let model = await StubModel.factory().create()
            expect(uuidValidated(model.id)).toBeTruthy()
            expect(model.name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()

            let modelFound = await StubModel.findByPk(model.id)
            expect(model.id).toBe(modelFound.id)

            model = await StubModel.factory().create({
                id: '13413155-bd02-456e-99c6-fd70cd16074f',
                name: 'Movie',
            })
            expect(model.id).toBe('13413155-bd02-456e-99c6-fd70cd16074f')
            expect(model.name).toBe('Movie')
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)

            modelFound = await StubModel.findByPk(model.id)
            expect(model.id).toBe(modelFound.id)
        })
    })

    describe('Make Method', () => {
        it('should be able one register', async () => {
            let model = await StubModel.factory().make()
            expect(uuidValidated(model.id)).toBeTruthy()
            expect(model.name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()

            model = await StubModel.factory().make({
                id: '13413155-bd02-456e-99c6-fd70cd16074f',
                name: 'Movie',
            })
            expect(model.id).toBe('13413155-bd02-456e-99c6-fd70cd16074f')
            expect(model.name).toBe('Movie')
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)
        })
    })
})
