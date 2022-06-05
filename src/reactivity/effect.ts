import {extend} from "../shared"

class ReactiveEffect {
  private _fn : any;
  public scheduler: Function | undefined;
  onStop?: ()=>void
  deps = []
  isActive = true;
  constructor(fn, scheduler?: Function){
    this._fn = fn
    this.scheduler = scheduler
  }

  run(){
    activeEffect = this
    return this._fn()
  }

  stop(){
    if(this.isActive){
      cleanupEffect(this)
      if(this.onStop){
        this.onStop()
      }
      this.isActive = false
    }
  }
}

// 保存正在运行的efffect
let activeEffect;
export function effect(fn, options:any={}){
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // _effect.onStop = options.onStop
  // 把options对象赋值给_effect
  extend(_effect, options)
  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

// 清空effect
function cleanupEffect(effect){
  effect.deps.forEach((dep:any)=>{
    dep.delete(effect)
  })
}

export function stop(runner){
  runner.effect.stop()
}



// 收集依赖：响应式对象的每个key建立一个ReactiveEffect对象
const targetMap = new WeakMap()
export function track(target, key){
  // target -> key -> dep
  // targetMap: {target: {}}
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // depsMap: {key: set()}
  let dep = depsMap.get(key)
  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  // dep: set(ReactiveEffefct....)
  if(!activeEffect) return

  dep.add(activeEffect)
  activeEffect.deps.push(dep)

}

// 触发依赖: 把key的dep执行fn
export function trigger(target, key){
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  for(const effect of dep){
    if(effect.scheduler){
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

