# Promise 与 async/await

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 异步
- Promise
- async/await
- js的垃圾回收机制

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 异步

##### 事件循环

###### 事件循环
> https://github.com/kvchen95/blog/blob/master/docs/js/event-loop.md

**为什么?**
JavaScript 是单线程的，但它需要处理很多异步操作（比如加载图片、发送网络请求等）。如果让 JS 一直等待这些异步操作完成，就会导致程序卡住，无法继续执行其他任务。为了解决这个问题，JS 把这些异步操作交给宿主环境（如浏览器或 Node.js）去处理，自己则继续执行后面的代码。等到异步操作完成后，宿主环境会通知 JS，JS 再回过头来处理这些异步任务的后续逻辑。

但是，任务一多，JS 就需要知道这些任务的执行顺序。于是，**任务队列** 就诞生了。任务队列就像一个**待办事项列表**，JS 会按照队列中的顺序依次处理任务。

**是什么**?
>**事件循环（EventLoop）** 就是用来实现这套任务调度机制的。它不断地从任务队列中取出任务并执行，确保 JS 能够高效地处理同步任务和异步任务。

在 JS 中，异步任务分为两种：
1. **浏览器处理的任务**（如 `setTimeout`、图片加载）：这些任务是由宿主环境处理的，完成后会被放入 **宏任务队列**。
2. **JS 自身的异步任务**（如 `Promise`、`async/await`）：这些任务是 JS 语言本身提供的，完成后会被放入 **微任务队列**。
为了确保任务的有序执行，JS 设计了一套规则：
- **微任务队列** 的优先级高于 **宏任务队列**。
- 每当一个宏任务执行完毕后，JS 会立即检查并执行所有微任务，直到微任务队列为空，才会继续执行下一个宏任务。


**事件循环的How?**

1. 执行全局同步代码. 也就是变量声明和赋值, 函数定义,等等.
2. 将异步任务放入对应的队列
	2.1 在执行全局同步代码的过程中，如果遇到异步任务（如 `setTimeout`、`Promise`），JS 会根据任务类型将其放入相应的队列：
	2.2 **宏任务队列**：存放由宿主环境处理的异步任务，如 `setTimeout`、`setInterval`、DOM 事件、AJAX 请求等。
	2.3 **微任务队列**：存放 JS 自身的异步任务，如 `Promise` 的 `then` 回调、`async/await`、`MutationObserver` 等。

3. 全局同步代码执行完毕. 此时事件循环开始工作,宏任务队列和微任务队列中可能已经又任务了.

4. **执行宏任务**：EventLoop 从宏任务队列中取出一个任务执行。 
	1. 这个任务可能是: 初始的脚本代码
	2. 后续的`setTimeout`, `setInterval`回调
    
5.  **执行所有微任务**：在当前宏任务执行过程中，如果产生微任务（如 Promise 的 `then` 回调），这些微任务会被放入微任务队列。在当前宏任务执行完毕后，EventLoop 会立即执行所有微任务，直到微任务队列为空。
    
- **渲染更新**：在浏览器环境中，执行完微任务后，可能会进行页面的渲染更新。
    
- **重复循环**：EventLoop 继续从宏任务队列中取出下一个任务，重复上述过程。


##### 实例
![[Pasted image 20241009134747.png]]
```js
setTimeout(() => {
    console.log("0")
  }, 0)
  new Promise((resolve,reject)=>{
    console.log("1")
    resolve()
  }).then(()=>{        
    console.log("2")
    new Promise((resolve,reject)=>{
      console.log("3")
      resolve()
    }).then(()=>{      
      console.log("4")
    }).then(()=>{       
      console.log("5")
    })
  }).then(()=>{  
    console.log("6")
  })

  new Promise((resolve,reject)=>{
    console.log("7")
    resolve()
  }).then(()=>{         
    console.log("8")
  })
```


##### 异步加载JS脚本的方法
>https://github.com/Easay/issuesSets/issues/122

**方法一：给script标签添加defer属性**
添加了defer属性，js脚本会异步加载，但会等到html解析完成后，在window.onload事件之前执行。
添加了defer属性的js文件执行的顺序和在文档中定义的顺序一样。
```html
<script src="../your_file.js" defer></script>
```
**方法二：给script标签添加async属性**
async属性会让js并行下载，但是js文件下载完成之后立刻执行无论html是否解析完毕
添加了async属性的js文件执行顺序不能保证
```js
<script src="../your_file.js" async></script>
```
**方法三：动态添加script标签**
和img标签不一样，设置了script的src属性并不会开始下载，而是要添加到文档中Js文件才会开始下载
```js
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'your_file.js';
// 只有添加到html文件中才会开始下载
document.body.append(script);
```
问题⚠️：异步加载script的目的是不对html的渲染造成阻塞，如果脚本中有操作dom的行为，则不能进行。但动态添加script标签需要获取body，所以该script代码段放的位置不能在head标签中，至少要放到body标签内。

**方法四：使用xhr脚本注入**
会受到同源策略的限制
```js
let xhr = new XMLHttpRequest()
xhr.open('get', './01.extra.js', true)
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = './01.extra.js';
            script.text = xhr.responseText;
            console.log(xhr.responseText)
            // 只有添加到html文件中才会开始下载
            document.body.append(script);
        }
    }
}
xhr.send(null);

```


##### 限制并发数（异步并发控制）?
>https://github.com/Easay/issuesSets/issues/143

```js
/**
 *
 * @param { 并发限制 } poolLimit
 * @param { promise 数组 } array
 * @param { callback } iteratorFn
 */
function asyncPool(poolLimit, array, iteratorFn) {
    let i = 0
    const ret = []
    const executing = []
    const enqueue = function () {
        // ① 边界条件，array 为空或者 promise 都已达到 resolve 状态
        if (i === array.length) {
            return Promise.resolve()
        }
        const item = array[i++]

        // ② 生成一个 promise 实例，并在 then 方法中的 onFullfilled 函数里返回实际要执行的 promise，
        const p = Promise.resolve().then(() => iteratorFn(item, array))
        ret.push(p)

        // ④ 将执行完毕的 promise 移除
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        // ③ 将正在执行的 promise 插入 executing 数组
        executing.push(e)
        // console.log(executing)
        let r = Promise.resolve()
        // ⑥ 如果正在执行的 promise 数量达到了并发限制，则通过 Promise.race 触发新的 promise 执行
        if (executing.length >= poolLimit) {
            r = Promise.race(executing)
            // console.log("r:")
            // console.log(r)
        }

        // ⑤ 递归执行 enqueue，直到满足 ①
        return r.then(() => enqueue())
    }
    return enqueue().then(() => Promise.all(ret))
}

const timeout = i => new Promise(resolve => setTimeout(() => {
    console.log(i)
    resolve(i)
}, i));
asyncPool(2,[1000,5000,3000,2000],timeout).then(results => {
    console.log(results)
})
```

### Promise

##### 概述

> Promise 是异步编程的一种解决方案，比传统的回调函数和事件更好。
> 所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。类比为订阅演唱会的时间地址.

##### 状态
Promise有三种状态，分别是：Pending（进行中）， Fulfilled(Resolved已完成)，Rejected (已失败)。
Promise从Pending状态开始，如果成功就转到成功态，并执行resolve回调函数；如果失败就转到失败状态并执行reject回调函数。

##### 优点
- 指定回调函数的时机更加灵活
	- 在异步操作启动前
	- 在异步操作完成后
- promise链式调用解决嵌套回调的回调地狱问题 
```js
// 异步操作启动前执行操作
let promise = doSomething()
promise.then(successCallback, failureCallback)

// 异步操作完成后指定回调
let promise = doSomething()
setTimeout(() => {(promise.then(successCallback, failureCallback)), 3000)
```


##### promise.prototype.then()返回值
Promise.then()方法返回一个新的 Promise 对象，它的状态和值取决于 then 中的回调函数的执行结果。具体来说，有以下几种情况：
* 返回一个Promise,其值和状态决定了返回Promise的值和状态
* 返回一个错误, 返回一个失败的Promise,其值为返回的错误
* 其它值 返回一个成功的Promise,其值为其它值


##### Promise-API实现

| 静态方法                         | 作用                                                                                                                                                         | 其他  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| Promise.all(iterable)        | 传入一个可迭代对象,返回一个promise<br/>* 当入参中所有的promise成功时(包括空迭代对象),返回的Promise才会成功,其值是一个成功状态值组成的数组.<br>> 当入参中由任意一个promise失败,返回的Promise才会失败, 其值是第一个失败的promise的值.         |     |
| Promise.allSettled(iterable) | 此静态方法接收一个包含promises的可迭代对象作为入参并返回单个Promise. 当所有入参的promise状态settle(包含空的迭代对象)之后,返回的promise才会解决(fullfill),并带有一个描述每个promise结果的对象数组.                             |     |
| Promise.any()                | 接收一个[`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)可迭代对象，只要其中的一个 `promise` 成功，就返回那个已经成功的 `promise` 。 |     |
| Promise.race                 | 返回一个Promise,一旦迭代器中的某个promise成功或拒绝,返回的promise就会解决或拒绝.                                                                                                       |     |


###### Promise.all

###### 概述
all方法接受一个或多个promsie（以数组方式传递），返回一个新promise，该promise状态取决于传入的参数中的所有promsie的状态：
当所有promise都完成时，返回的promise完成，其最终值为由所有完成promsie的最终值组成的数组；
当某一promise被拒绝时，则返回的promise被拒绝，其拒绝原因为第一个被拒绝promise的拒绝原因；

###### 代码实现
```javascript
//20220724
Promise.prototype.all = function (promises) {
	return new Promise((resolve, reject) => {
		// 判断是否为可迭代对象
		if (!Array.isArray(promises)) {
			throw new TypeError('promises must be an iterable object')
		}

		let resultArr = []
		promises.forEach((promise, idx) => {
			promise.then(
				value => {
					resultArr[idx] = value
					idx === (promises.length - 1) && resolve(resultArr)
				 },
				error => { 
					reject(error)
				}
			)
		})
	})
}
```

###### 案例
```js
function p1(){
    var promise1 = new Promise(function(resolve,reject){
        console.log("p1的第一条输出语句");
        console.log("p1的第二条输出语句");
        resolve("p1完成");
    })
    return promise1;
}

function p2(){
    var promise2 = new Promise(function(resolve,reject){
        console.log("p2的第一条输出语句");
        setTimeout(()=>{console.log("p2的第二条输出语句");resolve("p2完成")},2000);

    })
    return promise2;
}

function p3(){
    var promise3 = new Promise(function(resolve,reject){
        console.log("p3的第一条输出语句");
        console.log("p3的第二条输出语句");
        resolve("p3完成")
    });
    return  promise3;
}

Promise.all([p1(),p2(),p3()]).then(function(data){
    console.log(data);
})


//输出结果
p1的第一条输出语句
p1的第二条输出语句
p2的第一条输出语句
p3的第一条输出语句
p3的第二条输出语句
p2的第二条输出语句
['p1完成','p2完成','p3完成']
```

###### Promise.allSettled

```javascript
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([])
  
  const _promises = promises.map(
    item => item instanceof Promise ? item : Promise.resolve(item)
    )
  
  return new Promise((resolve, reject) => {
    const result = []
    let unSettledPromiseCount = _promises.length
    
    _promises.forEach((promise, index) => {
      promise.then((value) => {
        result[index] = {
          status: 'fulfilled',
          value
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      }, (reason) => {
        result[index] = {
          status: 'rejected',
          reason
        }
        
        unSettledPromiseCount -= 1
        // resolve after all are settled
        if (unSettledPromiseCount === 0) {
          resolve(result)
        }
      })
    })
  })
}
```


###### Promise.any

```javascript
function any(promises) {
  // return a Promise, which resolves as soon as one promise resolves
  return new Promise((resolve, reject) => {
    let isFulfilled = false
    const errors = []
    let errorCount = 0
    promises.forEach((promise, index) => promise.then(
      (data) => {
      if (!isFulfilled) {
        resolve(data)
        isFulfilled = true
      }
    }, 
      (error) => {
      errors[index] = error
      errorCount += 1

      if (errorCount === promises.length) {
        reject(new AggregateError('none resolved', errors))
      }
    }))
  })
}

//https://github.com/azl397985856/fe-interview/issues/125
Promise.any = ps => new Promise((resolve, reject) => {
  ps.forEach((p, idx) => p.then(resolve)).catch(err => idx === (ps.length - 1) && reject(new Aggregate('none resolved')))
})
```


###### Promise.race

```javascript
Promise.race2 = function(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => Promise.resolve(promise).then(resolve, reject))
  })
}
```


##### Promise面试题
>https://github.com/Easay/issuesSets/issues/77


###### 如何改变Promise的状态

```js
//3种方法
1.resolve() 状态由pending变为fulfilled
2.reject()  状态由pending变为rejected
3.抛出异常   状态由pending变为rejected
```


###### Promise状态改变和指定回调函数(then)谁先谁后

```js
1.都有可能. 正常时先指定回调再改变状态
2.先改变状态再指定回调的方法//同步
 2.1 直接调用resolve()/reject()
 2.2 延迟更长时间才调用then()
    let p = new Promise((resolve, reject)=>{
        setTimeout(()=>{resolve('ok')},1000);
    })
    setTimeout(()=>{p.then(value=>{console.log(value)})},3000)
 
3.先指定回调(先调用then方法)再改变状态//执行器种直接异步调用resolve()/reject()
   let p = new Promise((resolve,reject) => {
        setTimeout(function(){
            resolve('ok')
        },1000)
     })
     p.then(value => {
         console.log(value);
     })

4.什么时候得到数据?
4.1 如果先指定的回调函数,当状态发生改变时,调用回调函数,得到数据
4.2 如果先改变的状态,在指定回调函数时,回调函数就会调用,得到数据
```


###### Promise.then()返回新的Promise的结果状态由什么决定

```js
//then方法的返回结果是一个promise对象
(1)	简单表达: 由then()指定的回调函数执行的结果决定(执行结果就是函数的返回值)
(2)	详细表达:                                    
①	如果抛出异常, 新promise变为rejected, reason为抛出的异常/throw抛出的值
②	如果返回的是非promise的任意值, 新promise变为fulfilled(resolved) 值为返回值
③	如果返回的是另一个新promise, 此promise的结果就会成为新promise的结果,其值也会为then方法的返回值.
```


###### Promise异常穿透

```js
(1)	当使用promise的then链式调用时, 可以在最后指定失败的回调 
(2)	前面任何操作出了异常, 都会传到最后失败的回调中处理
```


###### Promise中断链条

```js
//返回一个pending状态的promise对象  return new Promise(()=>{})
//传一个错误的promise对象值,会被catch捕获,如果没有catch方法会报错
```


###### Promise.all如何将所有promise状态都保存下来
>https://github.com/Easay/issuesSets/issues/141

可以通过将所有primose状态都以resolved结束，即使内部请求挂掉被catch捕获到错误，但最后返回一个具体的值标识错误态即可。
```js
// ?
async function initAll() {
	const [
			loginComphasInited,
			activityConfig,
			styleData,
	] = await Promise.all([
			this.getLoginComp(),
			this.getActivityConfig(),
			this.getMarketingConfig(),
	])
	const { hasActivityConfig, hasEnded } = activityConfig
	if(!loginComphasInited || !hasActivityConfig) {
			this.handleError()
			return
	}
	if(hasEnded) {
			setPageSatus()
	}
}


async function activityConfig(){
	try{
		const { contracts, hasEnded } = await this.$apis.post()
		this.contracts = contracts || []
		return {
				hasActivityConfig: true,
				hasEnded,
		}
	}catch(err){
			return {
					hasActivityConfig: false,
			}
	}
}
```


###### 打印顺序
> https://juejin.cn/post/7055460626923012104
> https://juejin.cn/post/6945319439772434469


```js
setTimeout(() => {
    console.log("0")
  }, 0)
  
new Promise((resolve,reject)=>{
    console.log("1")
    resolve()
  }).then(()=>{        
    console.log("2")
    new Promise((resolve,reject)=>{
      console.log("3")
      resolve()
    }).then(()=>{      
      console.log("4")
    }).then(()=>{       
      console.log("5")
    })
  }).then(()=>{  
    console.log("6")
  })

new Promise((resolve,reject)=>{
    console.log("7")
    resolve()
  }).then(()=>{         
    console.log("8")
  })
```


###### 如果100个请求,使用Promise怎么控制并发  ??
>https://juejin.cn/post/7219961144584552504

题目
```js
// sendRequest(requestList:, limits, callback): void
sendRequest(
    [
        () => request('1'),
        () => request('2'),
        () => request('3'),
        () => request('4')
    ],
    3, // 并发数
    (res) => {
        console.log(res)
    }
)

// 其中 request 可以是：
function request(url, time = 1) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('请求结束：' + url);
            if (Math.random() > 0.5) {
                resolve('成功')
            } else {
                reject('错误')
            }
        }, time * 1e3)
    })
}
在格式化后的代码中，我们将每个参数放在新的一行，并使用适当的缩进来提高可读性。此外，我们还添加了注释来说明每个参数的作用。
```

概念
并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。
并发控制: 意思是多个并发的任务，一旦有任务完成，就立刻开启下一个任务
切片控制: 将并发任务切片的分配出来，比如10个任务，切成2个片，每片有5个任务，当前一片的任务执行完毕，再开始下一个片的任务，这样明显效率没并发控制那么高了

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```
在多核CPU上,并行的例子可能输出:
```js
并发和并行是两个概念:

并发(Concurrency):同一时间段内多个任务都在进行,但不一定同时进行。每个任务会互相切换执行,由操作系统根据一定的调度算法决定哪个任务该执行。

并行(Parallelism):多个任务同时进行,真正意义上的同时进行。一般需要多核CPU才能实现并行。

例子:

并发(Concurrency)的例子:
```js
// 两个任务依次执行,互相切换
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2'); 
setTimeout(() => console.log('Task 2 finished'), 1000);
```

并行(Parallelism)的例子,需要在多核CPU上执行:
```js
// 两个任务同时执行
console.log('Start task 1');
setTimeout(() => console.log('Task 1 finished'), 1000);

console.log('Start task 2');
setTimeout(() => console.log('Task 2 finished'), 1000);
```

在单核CPU上,上面的两个例子的输出都是:

```
Start task 1 
Start task 2
Task 1 finished
Task 2 finished
```

但在多核CPU上,并行的例子可能输出:
```js
Start task 1 
Start task 2 
Task 1 finished
Task 2 finished 
```
或
```js
Start task 1
Task 1 finished
Start task 2
Task 2 finished
```

这是因为两个任务可以同时执行,不需要互相切换.

```text
首先执行能执行的并发任务，根据并发的概念，每个任务执行完毕后，捞起下一个要执行的任务。

将关键步骤拆分出合适的函数来组织代码

1.  循环去启动能执行的任务
    
2.  取出任务并且推到执行器执行
    
3.  执行器内更新当前的并发数，并且触发捞起任务
    
4.  捞起任务里面可以触发最终的回调函数和调起执行器继续执行任务
```

```js
function sendRequest(requestList, limits, callback) {
  const promises = requestList; // 取得请求list
  const concurrentNum = Math.min(limits, requestList.length); // 得到开始时，能执行的并发数
  let concurrentCount = 0; // 当前并发数 

  // 第一次先跑起可以并发的任务
  const runTaskNeeded = () => {
    let i = 0;
    while (i < concurrentNum) {
      i++;
      runTask();
    }
  };

  // 取出任务并且执行任务
  const runTask = () => {
    const task = promises.shift();
    task && runner(task);
  };

  // 执行器
  // 执行任务，同时更新当前并发数
  const runner = async (task) => {
    try {
      concurrentCount++;
      await task();
    } catch (error) {
    } finally {
      // 并发数--
      concurrentCount--;
      // 捞起下一个任务
      picker();
    }
  };

  // 捞起下一个任务
  const picker = () => {
    if (concurrentCount < limits && promises.length > 0) {
      // 任务队列里还有任务并且此时还有剩余并发数的时候 执行
      // 继续执行任务
      runTask();
      // 队列为空的时候，并且请求池清空了，就可以执行最后的回调函数了
    } else if (promises.length == 0 && concurrentCount == 0) {
      // 执行结束
      callback && callback();
    }
  };

  // 入口执行
  runTaskNeeded();
}
```

另一种实现
核心代码是判断是当你 【有任务执行完成】 ，再去判断是否有剩余还有任务可执行。可以先维护一个pool（代表当前执行的任务），利用await Promise.race这个pool，不就知道是否有任务执行完毕了吗？
```js
async function sendRequest(requestList, limits, callback) {
  // 维护一个promise队列
  const promises = [];
  // 当前的并发池,用Set结构方便删除
  const pool = new Set(); // set也是Iterable<any>[]类型，因此可以放入到race里

  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 开始执行前，先await 判断 当前的并发任务是否超过限制
    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool)
        .catch((err) => err);
    }

    const promise = request(); // 拿到promise
    // 删除请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };
    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);
  }

  // 等待所有promise完成，调用回调函数
  Promise.allSettled(promises).then(callback, callback);
}
```

### async/await

##### 概述
* `async`用来描述`async`函数的.函数的返回值为promise对象.
* promise对象的结果和状态由`async`函数的返回值决定. 返回规则和then方法回调返回结果是一样的.
  * 如果返回结果是非promise类型的值,则返回值是成功的promise
  * 抛出一个错误, 函数的状态为失败状态rejected, 错误值为函数返回值.
  * 如果返回结果是promise类型的值, 则promise的状态和值决定了async这个promise的状态和返回
* await右侧的表达式一般为promise对象, 但也可以是其它的值
    * 如果表达式是promise对象, await返回的是promise成功的值.如果是失败的值,await会把promise的异常抛出, 我们可以使用try..catch捕获错误.
    * 如果表达式是其它值, 直接将此值作为await的返回值
* await...后面的代码相当于放到成功的回调中


##### async/await与promise的关系
- async/await是消灭异步回调的最终方法
- 简化promise对象的使用, 不用再使用then/catch来指定回调函数. 但和Promise并不互斥
- 执行async函数, 返回promise对象,  
  - await相当于promise的then
  - try...catch可捕获异常, 相当于promise的catch

### js的垃圾回收机制

>https://github.com/Easay/issuesSets/issues/91

##### 背景
JS引擎中对变量的存储主要有两种位置：栈内存和堆内存，栈内存存储基本数据类型以及引用数据的内存地址，堆内存储引用类型的数据。

##### 堆内存回收
V8的堆内存回收分为新生代内存和老生代内存，新生代内存是临时分配的内存，存在时间短，老生代内存存在时间长。

**新生代内存回收机制**
新生代内存容量小，64位系统下仅有32M。新生代内存分为From、To两部分，进行垃圾回收时，先扫描From，将非存活对象回收，将存活对象顺序复制到To中，之后调换From/To，等待下一次回收。
**老生代内存回收机制**
晋升：如果新生代的变量经过多次回收依然存在，那么就会被放入老生代内存中；
标记清除：老生代内存会先遍历所有对象并打上标记，然后对正在使用或被强引用的对象取消标记，回收被标记的对象；
整理内存碎片：把对象挪到内存的一端


##### 常见的GC算法
引用计数
使用引用计数器，当引用数字为0时立即回收。优点是：发现垃圾立即回收；缺点是：无法回收循环引用的对象。

标记清除
遍历所有对象，标记活动对象；再次遍历所有对象，清除没有标记的对象。将回收的空间加到空闲链表中，方便后面的程序申请使用。

标记整理
在标记和清除之间，添加了内存空间的整理。通过移动对象位置使得空间连续。

## Demo

待补充：可视化同步代码、Promise 微任务、`setTimeout` 宏任务的执行顺序。
