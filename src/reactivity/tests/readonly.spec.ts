import {readonly} from "../reactive"

describe("readonly", ()=>{
  it("happy path", ()=>{
    const original = {foo: 1, bar: {baz: 2}};
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  });

  it("warning when call set", ()=>{

    // mock 
    console.warn = jest.fn();

    const user = readonly({age: 10})

    user.age = 11
    expect(console.warn).toBeCalled();
  })
})