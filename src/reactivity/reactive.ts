import {mutableHandlers, readonlyHandlers} from "./baseHandlers"


export function reactive(raw){
  // return new Proxy(raw, mutableHandlers)
  return createReactiveObj(raw, mutableHandlers)
}

// readonly: 不能被set, 也就意味着不需要收集依赖
export function readonly(raw){
  // return new Proxy(raw, readonlyHandlers)
  return createReactiveObj(raw, readonlyHandlers)
}

function createReactiveObj(raw, baseHandlers){
  return new Proxy(raw, baseHandlers)
}