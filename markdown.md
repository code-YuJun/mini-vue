## reactive 原理
对象被 new Proxy 的方式代理，代理之后的对象有 get、set 方法
注意两个点：
1. 一个对象不要反复代理，使用Map做缓存。
```ts
// 用于记录代理后的结果
const reactiveMap = new WeakMap();
// 判断这个对象是否已经被代理过了，如果已经代理过，则直接返回
const exitsProxy = reactiveMap.get(target)
if(exitsProxy)  return exitsProxy
let proxy = new Proxy(target,mutableHandlers)
// 根据对象缓存代理后的结果
reactiveMap.set(target,proxy)
```
2. 避免一个代理后的对象再次被代理：访问代理后的对象的 __v_isReactive 属性，会调用到这个代理对象的 get 方法中，返回 true 则表示已经被代理
```ts
// 自定义独立标识
enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive" // 基本上唯一
}

// 判断是否被代理
if(target[ReactiveFlags.IS_REACTIVE]) return target

// if 的判断条件会走到 get 方法中
const mutableHandlers:ProxyHandler<any> = {
    // 被代理过的对象，获取属性时，才会执行get方法
    get(target,key,recevier){
        if(key === ReactiveFlags.IS_REACTIVE) return true
    },
    set(target,key,value,recevier){
        return true
    }
}
```
