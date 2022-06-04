import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../../../@seedwork/domain/entity/entity"
export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export class Category extends Entity<CategoryProperties>{

  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId){
    super(props, id)
    this.description = this.props.description
    this.is_active = this.props.is_active
    this.props.created_at = this.props.created_at ?? new Date()
  }

  public get name() {
    return this.props.name
  }

  private set name(value: string){
    this.props.name = value
  }

  public get description(){
    return this.props.description
  }

  private set description(value: string){
    this.props.description = value ?? null;
  }

  public get is_active()  {
    return this.props.is_active
  }

  private set is_active(value: boolean){
    this.props.is_active = value ?? true
  }

  public get created_at()  {
    return this.props.created_at
  }

  update(name: string, description?: string): void{
    this.name = name
    this.description = description
  }

  activate(){
    this.props.is_active = true
  }

  desactivate(){
    this.props.is_active = false
  }
}

