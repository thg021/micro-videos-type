import { deepFreeze } from "./object";

describe('Object Unit test', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze("a")
    expect(typeof str).toBe('string')

    let boolean = deepFreeze(true)
    expect(typeof boolean).toBe('boolean')

    boolean = deepFreeze(false)
    expect(typeof boolean).toBe('boolean')

    const num = deepFreeze(1)
    expect(typeof num).toBe('number')
  });

 
});