## reactive effect
```html
<div id="app"></div>
<script type="module">
    import {reactive,effect} from './reactivity.esm-browser.js'
    console.log(reactive)
    let people = reactive({
        name:'lisi',
        age:18
    })
    console.log(people)
    // 初始执行一次，数据变化之后再执行一次
    effect(() => {
        console.log('effect 执行')
        app.innerHTML = `姓名${people.name}年龄${people.age}`
    })
    setTimeout(() => {
        people.age++
    },2000)
</script>
```
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

## reflect
解决问题
```ts
const person = {
    name: 'lisi',
    get peopleName() {
        return this.name
    }
}
// 代理这个对象
let personProxy = new Proxy(person, {
    get(target, key) {
        console.log('get方法调用了')
        return target[key]
    },
    set(target, key, value) {
        target[key] = value
    }
})
// 访问 peopleName 属性
console.log(personProxy.peopleName)
/**
 * 现象：此时发现 get 方法只被调用了一次（peopleName），在 peopleName 方法中还访问了 person.name 属性，但没有调用 get 方法。
 * 原理：访问 personProxy.peopleName ，执行 get 方法，打印“get方法调用了”，然后访问  target[key] ，其实就是 person.peopleName
 * 其实就在访问 person.name，但是访问 person.name 是不会触发 get 方法， personProxy.name 才会触发 get。就不能直接 return target[key]
 * 方案1:
 *    get(target, key,receiver) {
        console.log('get方法调用了')
        return receiver[key]
      }
   这种方法直接死循环了，每次访问代理对象的属性，都会再次执行 get 方法
    
   方案2:
    get(target, key,receiver) {
        console.log('get方法调用了')
        return Reflect.get(target,key,receiver)
    }
    Reflect.get(target,key,receiver) 等价于 receiver[key]
    此时 this.name 就不是 person 而是代理对象。就会触发 get 方法。
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
 */
```
