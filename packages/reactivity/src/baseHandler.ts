export enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive" // 基本上唯一
}

export const mutableHandlers:ProxyHandler<any> = {
    // 被代理过的对象，获取属性时，才会执行get方法
    get(target,key,recevier){
        if(key === ReactiveFlags.IS_REACTIVE) return true
        return Reflect.get(target,key,recevier)
    },
    set(target,key,value,recevier){
        return Reflect.set(target,key,value,recevier)
    }
}
