var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactivity: () => reactivity
  });

  // packages/reactivity/src/effect.ts
  function effect(fn, options) {
  }

  // packages/shared/src/index.ts
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }

  // packages/reactivity/src/baseHandler.ts
  var mutableHandlers = {
    // 被代理过的对象，获取属性时，才会执行get方法
    get(target, key, recevier) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) return true;
      return Reflect.get(target, key, recevier);
    },
    set(target, key, value, recevier) {
      return Reflect.set(target, key, value, recevier);
    }
  };

  // packages/reactivity/src/reactivity.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactivity(target) {
    return createReactiveObject(target);
  }
  function createReactiveObject(target) {
    if (!isObject(target)) return target;
    if (target["__v_isReactive" /* IS_REACTIVE */]) return target;
    const exitsProxy = reactiveMap.get(target);
    if (exitsProxy) return exitsProxy;
    let proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.js.map
