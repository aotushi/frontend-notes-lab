# Proxy 是什么？

## 问题

`Proxy` 是什么？有什么作用？

## 结论

`Proxy` 可以包装一个对象，并拦截对象的基本操作，例如读取、写入、删除属性、函数调用、`in` 操作等。它常用于数据响应式、校验、日志、权限控制、默认值、API 代理等场景。

```js
const user = new Proxy({ name: 'Ada' }, {
  get(target, key) {
    console.log('get', key);
    return target[key];
  },
  set(target, key, value) {
    if (key === 'age' && value < 0) {
      throw new Error('age must be positive');
    }
    target[key] = value;
    return true;
  }
});

console.log(user.name);
user.age = 18;
```

面试回答：

> `Proxy` 是 ES6 提供的对象代理机制，可以拦截对象的读取、写入、删除、函数调用等基本操作。它常用于响应式系统、数据校验、日志和权限控制。Vue 3 的响应式系统就基于 Proxy 实现了对对象属性访问和修改的追踪。

## 参考来源

- [MDN: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
