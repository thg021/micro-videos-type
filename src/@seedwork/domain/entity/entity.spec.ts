import UniqueEntityId from "../value-objects/unique-entity-id.vo";
import Entity from "./entity";
import {validate as uuidValidate } from 'uuid'

interface StubEntityProps {
  prop1: string; 
  prop2: number;
}

const arrange = {prop1: "teste", prop2: 2}

class StubEntity extends Entity<StubEntityProps> {}
describe('Entity test unit', () => {
  it('should set props and id', () => {

    const entity = new StubEntity(arrange)
    expect(entity.props).toStrictEqual(arrange)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).not.toBeNull()
    expect(uuidValidate(entity.id)).toBeTruthy()
  });

  it('should accept a valida uuid', () => {
    const uniqueEntityId = new UniqueEntityId()
    const entity = new StubEntity(arrange, uniqueEntityId)
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId)
    expect(entity.id).toBe(uniqueEntityId.value)
  });

  it('should conver a entity to a Javascript Object', () => {
    const uniqueEntityId = new UniqueEntityId()
    const entity = new StubEntity(arrange, uniqueEntityId)
    expect(entity.toJSON()).toStrictEqual({id: entity.id, ...arrange})
  });
});