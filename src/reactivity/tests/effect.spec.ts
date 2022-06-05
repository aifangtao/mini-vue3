import {reactive} from "../reactive"
import {effect, stop} from "../effect"

describe("effect", ()=>{
  it("happy path", ()=>{
    const user = reactive({age: 10})
    
    let newAge;
    effect(()=>{
      newAge = user.age + 1;
    })

    expect(newAge).toBe(11)

    // update
    user.age ++;
    expect(newAge).toBe(12)
  })

  it("runner", ()=>{
    // effect函数会返回一个runner函数
    // runner 函数实际上就是effect的run函数
    // 调用runner时就是去执行fn并返回fn的返回值
    let foo = 10;
    const runner = effect(()=>{
      foo++;
      return "foo"
    })

    expect(foo).toBe(11)
    const ret = runner()
    expect(foo).toBe(12);
    expect(ret).toBe("foo")
  })

  it("scheduler", ()=>{
    // 1.scheduler作为effect的第二个参数
    // 2.effect第一次执行时，还是调用fn
    // 3.但是，当响应式对象进行set操作，也就是更新响应式对象的值时，是执行scheduler而不是fn
    // 4.当执行runner时，会再次执行fn
    let dummy;
    let run;
    const scheduler = jest.fn(()=>{
      run = runner;
    })
    const obj = reactive({foo: 1})
    const runner = effect(
      ()=>{dummy = obj.foo},
      {scheduler}
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1)
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2)
  })

  it("stop", ()=>{
    let dummy;
    const obj = reactive({prop: 1});
    const runner = effect(()=>{
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2);

    runner()
    expect(dummy).toBe(3)
  })
}) 