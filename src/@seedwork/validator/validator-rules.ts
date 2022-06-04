import ValidatorError from "../errors/validator-error";

export default class ValidatorRules {

  private constructor(private value: any, private property: string){}

  static values(value: any, property: string){
    return new ValidatorRules(value, property)
  }
  require(): this{
    if(this.value === null || this.value === undefined || this.value === ""){
      throw new ValidatorError(`The ${this.property} is required!`)
    }
    return this;
  }
  
  string(): this{
    if(typeof this.value !==  'string'){
      throw new ValidatorError(`The ${this.property} must be a string!`)
    }
    return this;
  }

  maxLenght(max: number): this{
    if(this.value.lenght > max){
      throw new ValidatorError(`The ${this.property} must be less or equal than ${max} characters!`)
    }
    return this;
  }
}