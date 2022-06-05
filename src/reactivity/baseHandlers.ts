import {track, trigger} from "./effect"

// get, set 做一个缓存
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false){
  return function get(target, key){
    const ret = Reflect.get(target, key)
    if(!isReadonly) {
      // 依赖收集
      track(target, key)
    }
    return ret
  }
}

function createSetter(){
  return function set(target, key, value){
    const ret =  Reflect.set(target, key, value)
    // 触发依赖
    trigger(target, key)
    return ret 
  }
}

// 可变的handlers, 即响应式对象可以被set
export const mutableHandlers = {
  get,
  set
}

// 只读的handlers
export const readonlyHandlers = {
  get: readonlyGet,
  set: function(target, key, value){
    console.warn(`key: ${key}不能被set`, target)
    return true
  }
}