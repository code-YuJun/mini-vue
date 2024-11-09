/**
 * 主要解决两个问题
 * 1. 同一个对象不被代理两次
 * 2. 对象代理之后的对象再次被代理
 */
import { isObject } from "shared"
// 用于记录代理后的结果
const reactiveMap = new WeakMap();
enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive" // 基本上唯一
}

export  function reactivity(target){
    return createReactiveObject(target)
}

const mutableHandlers:ProxyHandler<any> = {
    // 被代理过的对象，获取属性时，才会执行get方法
    get(target,key,recevier){
        if(key === ReactiveFlags.IS_REACTIVE) return true
    },
    set(target,key,value,recevier){
        return true
    }
}

function createReactiveObject(target){
    // 判断是否为一个对象，不是对象，则直接返回
    if(!isObject(target)) return target
    // 判断是否有 ReactiveFlags.IS_REACTIVE 时，已经出发了变量的 get 方法，返回 true 说明这个变量时一个被代理过的对象
    if(target[ReactiveFlags.IS_REACTIVE]) return target
    // 判断这个对象是否已经被代理过了，如果已经代理过，则直接返回
    const exitsProxy = reactiveMap.get(target)
    if(exitsProxy)  return exitsProxy
    let proxy = new Proxy(target,mutableHandlers)
    // 根据对象缓存代理后的结果
    reactiveMap.set(target,proxy)
    return proxy
}
