export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export class Category {
  constructor(public readonly props: CategoryProperties){}
  
  public get name() : string {
    return this.props.name
  }

  public get description() : string  {
    return this.props.description || ""
  }
  
  public get is_active() : boolean {
    return this.props.is_active || false
  }
  
  public get created_at() : Date {
    return this.props.created_at || new Date()
  } 
  
}
