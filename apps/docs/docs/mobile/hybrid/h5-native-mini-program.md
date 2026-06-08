# H5、Native App 与小程序交互

## 问题

H5 如何唤起 App、地图 App 或小程序？H5 和 Native App 怎么通信？页面给 App/小程序调用空白如何排查？

## 结论

H5 与 Native 或小程序交互通常分为三类：

| 场景 | 方案 |
| --- | --- |
| 唤起 App | URL Scheme、Universal Links、Android App Links |
| 唤起地图 | 地图厂商 URL Scheme 或 Web URL，失败时降级到网页地图 |
| JSBridge | Native 注入对象、拦截 URL、`postMessage`、自定义协议 |
| H5 打开小程序 | 微信 JS-SDK、开放标签或平台提供的跳转能力 |
| 小程序打开 H5 | web-view 传参、URL query、postMessage |

判断 App 是否安装不能完全由前端可靠获得。通常做法是尝试唤起，设置超时兜底，如果页面仍可见就跳到下载页或 Web 版。更稳的方案是 Universal Links / App Links，让系统负责路由。

H5 给 App 或小程序调用出现空白，排查顺序：

1. URL 是否可在普通浏览器打开。
2. HTTPS、证书、域名白名单、CSP、混合内容是否正常。
3. JSBridge 注入时机是否早于业务调用。
4. UA、容器内核和 WebView 版本是否满足 API 要求。
5. 路由 base、资源路径、跨域接口、登录态 Cookie 是否正确。
6. 控制台错误和网络请求是否被容器拦截。

## Demo

唤起 App 并兜底：

```js
function openApp({ schemeUrl, fallbackUrl }) {
  const start = Date.now();
  location.href = schemeUrl;

  setTimeout(() => {
    if (document.visibilityState === 'visible' && Date.now() - start < 1800) {
      location.href = fallbackUrl;
    }
  }, 1200);
}
```

JSBridge 调用应封装成异步能力检测：

```js
function callNative(method, payload) {
  if (!window.NativeBridge?.invoke) {
    return Promise.reject(new Error('NativeBridge is not ready'));
  }

  return window.NativeBridge.invoke(method, payload);
}
```

面试回答：

> H5 唤起 App 常用 URL Scheme、Universal Links 和 App Links，前端不能百分百判断是否安装，只能唤起后做超时兜底。H5 与 Native 通信用 JSBridge，常见方式是注入对象、拦截 URL 或 postMessage。H5 与小程序交互要走平台白名单和 JS-SDK 能力，空白页要从 URL、HTTPS、白名单、Bridge 注入、资源路径和接口跨域逐项排查。

## 参考来源

- [MDN: Deep linking](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Associate_files_with_your_PWA)
- [Apple: Universal Links](https://developer.apple.com/ios/universal-links/)
- [Android Developers: App Links](https://developer.android.com/training/app-links)
