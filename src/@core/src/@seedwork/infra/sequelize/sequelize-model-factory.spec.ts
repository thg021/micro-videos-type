import { SequelizeModelFactory } from './sequelize-model-factory'
import _chance from 'chance'
import {
    Column,
    DataType,
    Model,
    PrimaryKey,
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
        return new SequelizeModelFactory<
            StubModel,
            { id: string; name: string }
        >(StubModel, StubModel.mockFactory)
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
        it('should be able one register', () => {
            let model = StubModel.factory().make()
            expect(uuidValidated(model.id)).toBeTruthy()
            expect(model.name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()

            model = StubModel.factory().make({
                id: '13413155-bd02-456e-99c6-fd70cd16074f',
                name: 'Movie',
            })
            expect(model.id).toBe('13413155-bd02-456e-99c6-fd70cd16074f')
            expect(model.name).toBe('Movie')
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(1)
        })
    })

    describe('BulkCreate Method', () => {
        test('bulkcreate method using count 1', async () => {
            let model = await StubModel.factory().bulkCreate()
            expect(model).toHaveLength(1)
            expect(model[0].id).not.toBeNull()
            expect(model[0].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()

            const modelFound = await StubModel.findByPk(model[0].id)
            expect(model[0].id).toBe(modelFound.id)
            expect(model[0].name).toBe(modelFound.name)

            model = await StubModel.factory().bulkCreate(() => ({
                id: '13413155-bd02-456e-99c6-fd70cd16074f',
                name: 'Movie',
            }))

            expect(model[0].id).not.toBeNull()
            expect(model[0].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()
        })

        test('bulkcreate method using count > 1', async () => {
            let models = await StubModel.factory().count(2).bulkCreate()
            expect(models).toHaveLength(2)
            expect(models[0].id).not.toBeNull()
            expect(models[0].name).not.toBeNull()
            expect(models[1].id).not.toBeNull()
            expect(models[1].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)

            const modelFound1 = await StubModel.findByPk(models[0].id)
            expect(models[0].id).toBe(modelFound1.id)
            expect(models[0].name).toBe(modelFound1.name)

            const modelFound2 = await StubModel.findByPk(models[0].id)
            expect(models[0].id).toBe(modelFound2.id)
            expect(models[0].name).toBe(modelFound2.name)

            models = await StubModel.factory()
                .count(2)
                .bulkCreate(() => ({
                    id: chance.guid({ version: 4 }),
                    name: 'Movie',
                }))

            expect(models[0].id).not.toBe(models[1].id)
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
        })
    })

    describe('BulkMake Method', () => {
        test('bulkMake method using count 1', async () => {
            let model = StubModel.factory().bulkMake()
            expect(model).toHaveLength(1)
            expect(model[0].id).not.toBeNull()
            expect(model[0].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()

            model = await StubModel.factory().bulkMake(() => ({
                id: '13413155-bd02-456e-99c6-fd70cd16074f',
                name: 'Movie',
            }))

            expect(model[0].id).toBe('13413155-bd02-456e-99c6-fd70cd16074f')
            expect(model[0].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalled()
        })

        test('bulkMake method using count > 1', () => {
            let models = StubModel.factory().count(2).bulkMake()
            expect(models).toHaveLength(2)
            expect(models[0].id).not.toBeNull()
            expect(models[0].name).not.toBeNull()
            expect(models[1].id).not.toBeNull()
            expect(models[1].name).not.toBeNull()
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)

            models = StubModel.factory()
                .count(2)
                .bulkMake(() => ({
                    id: chance.guid({ version: 4 }),
                    name: 'Movie',
                }))

            expect(models[0].id).not.toBe(models[1].id)
            expect(StubModel.mockFactory).toHaveBeenCalledTimes(2)
        })
    })
})
