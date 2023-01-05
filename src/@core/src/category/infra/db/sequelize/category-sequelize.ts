import {
    Column,
    DataType,
    PrimaryKey,
    Table,
    Model,
} from 'sequelize-typescript'
import Chance from 'chance'
import { SequelizeModelFactory } from '#seedwork/infra/sequelize/sequelize-model-factory'
import { Category, CategoryRepository } from '#category/domain'
import NotFoundError from '#seedwork/domain/errors/not-found-error'
import UniqueEntityIdVo from '#seedwork/domain/value-objects/unique-entity-id.vo'
import { Op } from 'sequelize'
import { EntityValidationError } from '#seedwork/domain'
import { LoadEntityError } from '#seedwork/domain/errors/load-entity.error'

export namespace CategorySequelize {
    type CategoryModelProps = {
        id: string
        name: string
        description: string
        created_at: Date
        is_active: boolean
    }

    @Table({
        tableName: 'categories',
        timestamps: false,
    })
    export class CategoryModel extends Model<CategoryModelProps> {
        @PrimaryKey
        @Column({ type: DataType.UUID() })
        declare id: string

        @Column({ allowNull: false, type: DataType.STRING(255) })
        declare name: string

        @Column({ allowNull: true, type: DataType.TEXT() })
        declare description: string | null

        @Column({ allowNull: false, type: DataType.BOOLEAN() })
        declare is_active: boolean

        @Column({ allowNull: false, type: DataType.DATE() })
        declare created_at: Date

        static factory() {
            const chance: Chance.Chance = require('chance')()

            return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(
                CategoryModel,
                () => ({
                    id: chance.guid({ version: 4 }),
                    name: chance.word(),
                    description: chance.paragraph(),
                    is_active: true,
                    created_at: chance.date(),
                }),
            )
        }
    }

    export class CategorySequelizeRepository
        implements CategoryRepository.IRepository
    {
        // typeof porque nao estamos passando a class instanciada
        constructor(private categoryModel: typeof CategoryModel) {}
        sortableFields: string[] = ['name', 'created_at']

        async insert(entity: Category): Promise<void> {
            await this.categoryModel.create(entity.toJSON())
        }

        async findById(id: string | UniqueEntityIdVo): Promise<Category> {
            const category = await this._get(id.toString())
            return CategoryModelMapper.toEntity(category)
        }

        async findAll(): Promise<Category[]> {
            const categories = await this.categoryModel.findAll()

            return categories.map((category) =>
                CategoryModelMapper.toEntity(category),
            )
        }

        async update(entity: Category): Promise<void> {
            await this.categoryModel.update({ ...entity })
        }

        delete(id: string | UniqueEntityIdVo): Promise<void> {
            throw new Error('Method not implemented.')
        }

        async search({
            filter,
            page,
            per_page,
            sort,
            sort_dir,
        }: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
            const offset = (page - 1) * per_page
            const limit = per_page

            const { rows: models, count } =
                await this.categoryModel.findAndCountAll({
                    ...(filter && {
                        where: { name: { [Op.like]: `%${filter}%` } },
                    }),
                    ...(sort && this.sortableFields.includes(sort)
                        ? { order: [[sort, sort_dir]] }
                        : { order: [['created_at', 'DESC']] }),
                    offset,
                    limit,
                })

            return new CategoryRepository.SearchResult({
                items: models.map((m) => CategoryModelMapper.toEntity(m)),
                total: count,
                current_page: page,
                per_page,
                filter,
                sort,
                sort_dir,
            })
        }

        private async _get(id: string) {
            return await this.categoryModel.findByPk(id, {
                rejectOnEmpty: new NotFoundError(
                    `Entity Not Found using ID ${id}`,
                ),
            })
        }
    }

    export class CategoryModelMapper {
        static toEntity(model: CategoryModel): Category {
            const { id, ...orderData } = model.toJSON()
            try {
                return new Category(orderData, new UniqueEntityIdVo(id))
            } catch (e) {
                if (e instanceof EntityValidationError) {
                    throw new LoadEntityError(e.error)
                }

                throw e
            }
        }
    }
}
