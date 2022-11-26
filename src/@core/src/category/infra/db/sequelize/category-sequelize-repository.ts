import { Category, CategoryRepository } from '#category/domain'
import NotFoundError from '#seedwork/domain/errors/not-found-error'
import uniqueEntityIdVo from '#seedwork/domain/value-objects/unique-entity-id.vo'
import { Op } from 'sequelize'
import { CategoryModel } from './category-model'
import { CategoryModelMapper } from './category-model-mapper'

export class CategorySequelizeRepository
    implements CategoryRepository.IRepository
{
    // typeof porque nao estamos passando a class instanciada
    constructor(private categoryModel: typeof CategoryModel) {}
    sortableFields: string[] = ['name', 'created_at']

    async insert(entity: Category): Promise<void> {
        await this.categoryModel.create(entity.toJSON())
    }

    async findById(id: string | uniqueEntityIdVo): Promise<Category> {
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

    delete(id: string | uniqueEntityIdVo): Promise<void> {
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
            rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`),
        })
    }
}
