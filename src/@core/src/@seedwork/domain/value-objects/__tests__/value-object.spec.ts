import ValueObject from '../value-object'
// Para class abstratas precisaremos gerar um STUB

class StubValueObject extends ValueObject {}
describe('Value Objects test unit', () => {
    it('should set value', () => {
        let vo = new StubValueObject('string value')
        expect(vo.value).toBe('string value')

        vo = new StubValueObject({ prop1: 'value1' })
        expect(vo.value).toStrictEqual({ prop1: 'value1' })
    })

    describe('should  covert to a string', () => {
        const date = new Date()
        const data = [
            { received: '', expected: '' },
            { received: 1, expected: '1' },
            { received: 'string', expected: 'string' },
            { received: true, expected: 'true' },
            { received: date, expected: date.toString() },
            {
                received: { prop1: 'value' },
                expected: JSON.stringify({ prop1: 'value' }),
            },
        ]

        test.each(data)(
            'from $received to $expected',
            ({ received, expected }) => {
                const vo = new StubValueObject(received)
                expect(vo + '').toBe(expected)
            },
        )
    })

    it('should be a immutable object', () => {
        const obj = {
            prop1: 'value1',
            deep: { prop2: 'value2', prop3: new Date() },
        }
        const vo = new StubValueObject(obj)
        expect(() => {
            ;(vo as any).value.prop1 = 'test'
        }).toThrow(
            "Cannot assign to read only property 'prop1' of object '#<Object>'",
        )

        expect(() => {
            ;(vo as any).value.deep.prop2 = 'test'
        }).toThrow(
            "Cannot assign to read only property 'prop2' of object '#<Object>'",
        )

        expect(vo.value.deep.prop3).toBeInstanceOf(Date)
    })
})
