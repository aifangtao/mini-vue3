import {reactive} from "../reactive"

describe("reactive", ()=>{
  it("happy path", ()=>{
    const original = {foo: 1}
    const observered = reactive(original)

    expect(observered).not.toBe(original)
    expect(observered.foo).toBe(1)

  })
})