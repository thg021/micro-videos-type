import ValueObject from "../value-object";
//Para class abstratas precisaremos gerar um STUB

class StubValueObject extends ValueObject{}
describe('Value Objects test unit', () => {
  it('should set value', () => {
    let vo = new StubValueObject('string value')
    expect(vo.value).toBe('string value')

    vo = new StubValueObject({prop1: 'value1'})
    expect(vo.value).toStrictEqual({prop1: 'value1'})
  });

  it('should  covert to a string', () => {
    const date = new Date
    const data = [
      {received: "", expected: ""},
      {received: 1, expected: "1"},
      {received: "string", expected: "string"},
      {received: true, expected: "true"},
      {received: date, expected: date.toString()},
      {received: {prop1: 'value'}, expected: JSON.stringify({prop1: 'value'})},
    ]

    data.forEach(item => {
      const vo = new StubValueObject(item.received)
      expect(vo + "").toBe(item.expected)
    })
 
  });

  it('immutable', () => {
    const vo = new StubValueObject({prop1: 'value1'})
   
    console.log(vo)
  })
});