# 常见手写题

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 手写代码
- 来源
- 防抖节流原理及应用
- 深拷贝
- 数组相关
- 函数相关
- 字符串处理
- instanceof内部原理和实现
- 函数柯里化
- 高阶函数

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 手写代码

#### 来源
* https://bigfrontend.dev/zh/problem

#### 深拷贝

##### 是什么
深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。

浅拷贝: 当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在==栈==中的地址，而不是堆中的数据。两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。

##### 浅拷贝
和深拷贝对应的浅拷贝,JS中的相关方法有:
* `[].slice(0)`
* `[].concat(arr)`
* 展开运算符
* Object.assign(obj1,obj2)

##### 深拷贝实现方式
* structuredClone
- JSON.parse(JSON.stringfy(obj)) 
  -  ===> 问题: 方法/函数会丢失(undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时)
  -  ===> 问题2: 循环引用会出错(死循环)
- 递归遍历
  - 如果是基本类型与函数直接返回, 函数就不会丢失也不会拷贝
  - 如果是对象/数组创建拷贝对象/数组
  - 问题: 循环引用会出错的问题(死循环)
- 使用Map缓存拷贝对象
  - 如果发现一个对象已经产生拷贝对象, 直接返回这人拷贝对象
  - 使用Map存储 ==> key为源对象, value是拷贝产生的对象  (不能用对象来存储, 因为对象的key为字符串)
- 库. lodash

```js
/* 
1). 大众乞丐版
    问题1: 函数属性会丢失   原因: json字符串数据是不存在函数, 函数属性就会丢失
    问题2: 循环引用会出错   原因: 转换为json字符串是会产生死循环查找, 报错
利用JSON转换成json字符串, 再解析回来
*/
deepClone1 (target) {
  if (target!==null && typeof target==='object' ) {
    return JSON.parse(JSON.stringify(target))
  } else {
    return target
  }
},
```


```javascript
//作者：神三元
//链接：https://juejin.cn/post/6844903986479251464
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
}

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if(!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if(!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag: 
      return new Object(Boolean.prototype.valueOf.call(target));
      // valueOf方法从对象中提取出其基本类型
      // new Object是为了创建了一个新的某某对象包装器
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag: //es6不推荐使用new,Symbol无法使用;所以使用valueOf
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag: 
    case dateTag:
      // Date对象，valueOf方法返回的是日期的毫秒表示,使用Object包装会变成数值类
      // Error`对象表示运行时错误，并且它们通常包含消息、堆栈追踪和其他属性。valueOf方法并不适用于获取Error对象的所有信息
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
}

const deepClone = (target, map = new WeakMap()) => {
  if(!isObject(target)) 
    return target;
  let type = getType(target);
  let cloneTarget;
  if(!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  }else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if(map.get(target)) 
    return target;
  map.set(target, true);

  if(type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if(type === setTag) {
    //处理Set
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
}
```


##### 复述一下深拷贝的操作流程:

* 定义函数,  参数(target, map=new WeakMap())
* 判断是否是对象(判断条件), 非对象直接返回
* 获取具体的对象类型
* 判断是否是 5种 可遍历的对象 (可遍历对象5个: Array/Object/Set/Map/Arguments)
  * 如果是不可遍历的对象, 声明外部函数`handleNotCanTraverse(target, type)`来处理
    * 一类: 调用原型上的`valueOf`方法获取原始值, 再使用`new Object()`生成包装类对象 (string / number / boolean /symbol )
    * 一类: 默认调用原型上的构造函数,生成新的对象 (date error)
    * 一类: 调用独立的方法来处理( 正则表达式, 函数)
  * 如果是可遍历的对象
    * 首先是:  通过`target.constructor`属性获取其构造函数, 调用构造函数生成相应的实例对象
    * 如果存在对象引用 , 会提前在函数的参数中添加`map = new WeakMap()` (这个地方不熟悉的话可以省略不说)
      * 存在对象引用: 直接返回这个对象; 
      * 当前对象不存在引用, 将当前对象添加进map集合中 `map.set(target, true)`
    * 如果是map类型
      * `cloneTarget.set(deepClone(key, map), deepClone(item, map))`
    * 如果是set类型
      * `cloneTarget.add(deepClone(item , map))`
    * 如果是对象 / 数组 类型, 使用`for...in`循环来处理
      * `cloneTarget[key] = deepClone(target[key], map)`


#### 数组相关

##### 判断数据类型是否为数组的方案7种
* [] instanceof Array
* [].\_\_proto\_\_ === Array.prototype
* [].constructor === Array
* Array.prototype.isPrototypeOf([])
* Object.getPrototypeOf([]) === Array.prototype
* Object.prototype.toString.call([]).slice(8, -1)
* Array.isArray([])


##### 数组扁平化 7种
* toString + split
* flat
* JSON.stringify + replace + split / JSON.parse
* 递归
  * for ...of
  * reduce
* 展开运算符 + some 
```javascript
//toString + split

arr.toString().split(',')

//flat
arr.flat(Infinity)

//JSON + replace+split
//JSON.stringify(arr.replace(/\[|\]/g, '')).split(',')
JSON.stringify(arr).replace(/\[|\]/g, '').split(',')``

//JSON + replace + JSON.parse
let res = JSON.stringify(arr).replace(/\[|\]/g, '')
let newArr = JSON.parse('[' + res + ']')

//递归+for/reduce
let res = []
function flat(arr) {
  for (let i=0; i<arr.length; i++) { 
    if (Array.isArray(arr)) {
    	flat(arr[i])
  	} else {
      res.push(arr[i])
    }
  }
}
//
function flat(arr) {
  return arr.reduce((pre, crt) => {
    return pre.concat(Array.isArray(crt) ? flat(crt) : pre.concat(crt)
  }, [])
}
                    

//展开运算符
while(arr.some(Array.isArray)) {
    arr = [].concat(...arr)  // arr = [].concat(arr) 加不加展开运算符都一样的 多循环一次
  }
```


##### 实现flat
```javascript
//递归
// arguments.callee指向argumetns对象所在函数的指针, 实现函数名与逻辑的解耦
function flat(arr) {
  let res = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(arguments.callee(item)) 
      // res.push(...arguments.callee(item))
    } else {
      res.push(item)
    }
  })
  
  return res
}

//reduce
const flat = arr => {
  return arr.reduce((acc, crt) => {}, [
    return acc.concat(Array.isArray(crt) ? flat(crt) : crt)
  ])
}

//其他方法
```


##### 数组去重 7 种
* for + for  + splice
* for + for+ 新数组
* for + indexOf / includes
* reduce + indexOf/includes
* filter + indexOf / sort()
  * indexOf存在的问题
  * sort排序的问题  sort()排序有漏洞, 并不适用于特殊类型的排序. !!!!???
* sort快慢指针
* 键值对 
	* object键值对+filter(存在的问题: 不能去重正则表达式)
	* map键值对+filter
* new Set()
```javascript
let arr = [1,2,3,1,1,4,3,2,5,6,7];
// for + for 

for (let i=0; i<arr.length; i++) {
  for (let j=i+1; j<arr.length; j++) {
	  if (arr[j] === arr[i]) {
		  arr.splice(j, 1)
	    j--
	  }
  }
}

//for + 新数组

let newArr = []
let j;

for (let i=0; i<arr.length; i++) {
  for (j=0; j<newArr.length; j++) {
    if (arr[i] === newArr[j]) {
      break
    }
  }
  if (j === newArr.length) {
    newArr.push(arr[i])
  }
}

let newArr = [];
for (let i = 0, len = arr.length; i < len; i++) {
	let isDuplicate = false;
	for (let j = 0, len2 = newArr.length; j < len2; j++) {
		if (arr[i] === newArr[j]) {
			isDuplicate = true;
			break;
		}
	}
	if (!isDuplicate) {
		newArr.push(arr[i]);
	}
}
```


```javascript
//for + indexOf / includes

let res = []
for (let i=0; i<arr.length; i++) {
  if (res.indexOf(arr[i] === -1)) { // !res.includes(arr[i])
    res.push(arr[i])
  }
}
```


```javascript
// reduce + indexOf / includes

arr.reduce((pre, crt) => pre.includes(crt) ? pre : pre.concat(crt), [])
arr.reduce((pre, crt) => pre.indexOf(crt) === -1 ? pre.concat(crt) : pre, [])
```


```javascript
//filter + indexOf

arr.filter((item, idx, arr) => arr.indexOf(item) == idx)
//存在的问题
1.arr.indexOf(NaN)的结果是-1,所以会忽略NaN这个值.
2.对象不去重

arr.concat().sort().filter((item, idx, arr) => !idx || item !== arr[idx - 1])
```


```javascript
//sort快慢指针

//https://juejin.cn/post/6844904202162929671

function unique(arr) {
  arr.sort((a, b) => a - b);
  let left = 0,
      right = 1;
  
  while(right < arr.length) {
    if (arr[left] === arr[right]) {
      right++;
    } else {
      arr[left + 1] = arr[right];
      left++;
      right++;
    }
  }
  return arr.slice(0, left+1);
}

//https://juejin.cn/post/7033275515880341512
function unique2(arr) {
  arr.sort((a, b) => a - b);
  let slow = 1,
      fast = 1;
  
  while(fast < arr.length) {
    if (arr[fast - 1] !== arr[fast]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
```


```javascript
//object键值对

// 考虑到 `JSON.stringify` 任何一个正则表达式的结果都是 `{}`，所以这个方法并不适用于处理正则表达式去重。

let obj = {}
arr.filter( v => obj.hasOwnProerpty(v) ? false : (obj[typeof v + JSON.stringify(v)] = true))
```


```javascript
//map键值对

let map = new Map()
arr.fitler((item, idx, arr) => !map.has(item) && map.set(item, true))
```


```javascript
// set
let res = (arr) => [...new Set(arr)]
```

##### 数组去重存在的问题

重点关注下 对象 和NaN 的去重

| 方法                                                         | 结果                                                         | 说明                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| for循环(双for+新数组)                                        | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| indexOf(作者用的是新数组+for循环+indexOf方法)                | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| sort<br />结论是数字1不去重,没有勘误.不知道是哪个数字1,是包装类的吗? | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 <br />数字 1 也不去重 |
| filter+indexOf                                               | [1, "1", null, undefined, String, String, /a/, /a/]          | 对象不去重 NaN 会被忽略掉               |
| filter+sort                                                  | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 数字 1 不去重         |
| 优化后的键值对方法                                           | [1, "1", null, undefined, String, /a/, NaN]                  | 全部去重                                |
| Set                                                          | [1, "1", null, undefined, String, String, /a/, /a/, NaN]     | 对象不去重 NaN 去重                     |


##### 数组翻转

1. 使用原型中的reverse方法

   ```js
   let array = [1, 2, 3, 4, 5]
   array.reverse() 
   ```
   
2. 循环
* 临时变量(索引之和等于长度减1)
* unshift
   ```js
   for(var i = 0; i < arr.length; i++){
       var temp = arr[i];
       arr[i] = arr[arr.length - 1 - i]
       arr[arr.length - 1 - i] = temp;
   }
   
   ```

   


##### 排序算法
> https://github.com/Easay/issuesSets/issues/44

###### 简单排序: 冒泡 / 选择 / 插入

```js
/* 
冒泡排序的方法
*/
function bubbleSort (array) {
  // 1.获取数组的长度
  var length = array.length;

  // 2.反向循环, 因此次数越来越少
  for (var i = length - 1; i >= 0; i--) {
    // 3.根据i的次数, 比较循环到i位置
    for (var j = 0; j < i; j++) {
      // 4.如果j位置比j+1位置的数据大, 那么就交换
      if (array[j] > array[j + 1]) {
        // 交换
        // const temp = array[j+1]
        // array[j+1] = array[j]
        // array[j] = temp
        [array[j + 1], array[j]] = [array[j], array[j + 1]];
      }
    }
  }

  return arr;
}

/* 
选择排序的方法
*/
function selectSort (array) {
  // 1.获取数组的长度
  var length = array.length

  // 2.外层循环: 从0位置开始取出数据, 直到length-2位置
  for (var i = 0; i < length - 1; i++) {
    // 3.内层循环: 从i+1位置开始, 和后面的内容比较
    var min = i
    for (var j = min + 1; j < length; j++) {
      // 4.如果i位置的数据大于j位置的数据, 记录最小的位置
      if (array[min] > array[j]) {
        min = j
      }
    }
    if (min !== i) {
      // 交换
      [array[min], array[i]] = [array[i], array[min]];
    }
  }

  return arr;
}

/* 
插入排序的方法
*/
// 插入排序实现
function insertionSort(arr) {
    // 对传入数组的拷贝进行排序，避免修改原数组
    const array = [...arr];
    
    // 从第二个元素开始遍历
    for (let i = 1; i < array.length; i++) {
        // 保存当前要插入的元素
        const current = array[i];
        let j = i - 1;
        
        // 将所有大于 current 的元素向右移动一位
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            j--;
        }
        
        // 在正确的位置插入当前元素
        array[j + 1] = current;
    }
    
    return array;
}
```


###### 快速排序

```js
function quickSort(arr) {
  // 递归结束的条件
  if(arr.length < 2){
    return arr
  }
  // 获取中间值
  let flag = Math.floor(arr.length / 2);
  let flagValue = arr.splice(flag, 1)[0];
  
  let leftArr = [];
  let rightArr = [];
  for (var i = 0; i < arr.length; i++) {
    var arrItem = arr[i];
    
    if(arrItem > flagValue){
      rightArr.push(arrItem)
    }else {
      leftArr.push(arrItem)
    }
  }
  
  leftArr = quickSort(leftArr);
  rightArr = quickSort(rightArr);
  return [...leftArr, flagValue, ...rightArr]
}
```


#### 函数相关

##### 函数的call() / apply() / bind()

```javascript

//call
Function.prototype.call2 = function(...items) {
  let obj = items.shift() || globalThis
  let tempFn = Symbol()
  obj[tempFn] = this
  
  let res = obj[tempFn](...items)
  delete obj[tempFn]
  
  return res
}

// 不建议使用arguments
Function.prototype.myCall = function() {
  let obj = [].shift.call(arguments) || globalThis;
  obj.tempFn = this
  
  let res = obj.tempFn(...[...arguments]);
  delete obj.tempFn;
  return res;
}


//apply
Function.prototype.apply2 = function(...items) {
  let obj = items.shift() || globalThis
  obj[tempFn] = this
  let res = obj[tempFn](items)
  delete obj[tempFn]
  
  return res
}

//bind

//1 version
Function.prototype.bind = function(cxt) {
  let fn = this
  let argsOut = [].slice.call(arguments)
  return function() {
    let argsInner = [].slice.call(arguments)
    fn.apply(cxt, argsOut.concat(argsInner))
  }
}

//

//2 version  避免实例通过原型链更改函数原型上的属性,使用空函数中转 + 可以使用new调用
Function.prototype.bind = function () {
	let fn = this
  let argsOut = [].slice.call(arguments, 1)
  let fNOP = function() {}
  let fbound = function () {
    let argsInner = [].slice.call(arguments)
    return fn.apply(this instanceof fNOP ? this : crt, argsOut.concat(argusInner))
  }
  
  fNOP.prototype = this.prototype
  fbound.prototype = new fNOP()
  return fbound
}
```


```js
/* 
自定义函数对象的call方法
*/
function call (fn, obj, ...args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
自定义函数对象的apply方法
*/
function apply (fn, obj, args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
  自定义函数对象的bind方法
  重要技术:
    高阶函数
    闭包
    call()
    三点运算符
*/
function bind (fn, obj, ...args) {
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  
  return function (...args2) {
    call(fn, obj, ...args, ...args2)
  }
}
```


#### 字符串处理

```js
/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/

/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
*/
function reverseString(str) {
  // return str.split('').reverse().join('')
  // return [...str].reverse().join('')
  return Array.from(str).reverse().join('')
}

/* 
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
*/
function palindrome(str) {
  return str === reverseString(str)
}

/* 
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/
function truncate(str, num) {
  return str.length > num ? str.slice(0, num) + '...' : str
}
```


#### instanceof内部原理和实现

instanceof运算符判断一个对象是否为另一个对象的实例

```javascript

function isntanceof2(case, Ctor) {
    //基本数据类型返回false
  //兼容一下函数对象
  if (typeof(Case) !== 'object' && typeof(Ctor) !== 'function' || Case === 'null') {
    return false;
  }
  
  let caseProto = Object.getPrototypeOf(case)
  while(true) {
    if (caseProto == null) return false
    //找到相同的原型
    if (caseProto === Ctor.prototype) return true
    caseProto = Object.getPrototypeOf(caseProto)
  }
}


```


#### 函数柯里化
> https://github.com/Easay/issuesSets/issues/78


函数柯里化是一种将接收多个参数的函数转换为接收一个参数并返回另一个函数的技术。更加灵活地控制函数的功能和输入。

##### 案例
考虑一个接收两个参数的函数，它将它们相乘并返回结果：
```js
function multiply(a, b) {
  return a * b;
}

multiply(2, 3);  // 6
```

使用柯里化转换函数
```js
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

multiply(2)(3);  // 6
```


##### 实现代码
```js
function curryIt(fn){
    var args = [];
    return function curried() {
        // 类数组转数组方式1：
        var arg = [].slice.call(arguments);
        // 方式2：
        //var arg = Array.from(arguments);
        args = args.concat(arg);
        if(args.length < fn.length){
            // return arguments.callee;
            return function () {
	            return curried.apply(this, args.concat(arguments))
            }
        }else{
            return fn.apply(null,args);
        }
    }   
}
```


##### 使用setTimeout实现setInterval
>https://github.com/Easay/issuesSets/issues/95
```js
function mySetInterval(fn, delay) {
	function interval() {
		setTimeout(interval, delay)
		fn()
	}
	setTimeout(interval, delay)
}

mySetInterval(() => console.log(1), 1000)


```
//实现clearInterval
```js
let id = 0
let timeMap = {}
const mySetInterval = (cb, time) => {
	let timeId = id;
	id++
	const fn = () => {
		cb()
		timeMap[timeId] = setTimeout(() => {fn()}, time)
	}
	timeMap[timeId] = setTimeout(fn, time)
	return timeId
}

function clearInterval(id) {
	clearTimeout(timeMap[id])
	delte timeMap[id]
}

let newId = mySetInterval(count, 1000)
setTimeout(() => clearInterval(newId), 3000)

function count() {
	console.log('a')
}
```


##### 实现一个准确的倒计时 ?
>https://github.com/Easay/issuesSets/issues/105


##### 实现curry() -(BEF.dev)
```js

function curry() {
	let 
}
```


#### 高阶函数
##### 实现一个currying函数
> https://bigfrontend.dev/problem/implement-curry
```js
//错误方法
function curry(fn) {
	let args = []
	return function curried() {
		args.push(...arguments)
		if (args < fn.length) {
			return curried
		} else {
			return fn(...args)
		}
	}
}

//正确方法
function curry(fn) {
	return curried(...args) {
		let fnArgsLen = fn.length
		if (args.length < fnArgsLen) {
			return function(...moreArgs) {
				return curried.apply(this, args.concat(moreArgs))
			}
		} else {
			return fn.apply(this, args)
		}
	}
}
```

##### 按需求实现一个debounce函数
> https://bigfrontend.dev/problem/implement-basic-debounce

```js

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const debounced = debounce(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => debounced(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['C@5'])


function debounce(fn, delay) {
	let timeout
	return function(...args) {
		if (timeout) {
			clearTimeout(timeout)
		}

		
	}
}
```

### 来源

> [CSS中 块级元素、行内元素、行内块元素区别](https://juejin.cn/post/6998925491797229599)
> https://developer.mozilla.org/zh-CN/docs/Web/HTML/Inline_elements

### 防抖节流原理及应用

##### 使用背景
如果是复杂的回调函数或是 ajax 请求呢? 假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。出现防抖和节流两种方案.

(高频操作导致一定时间内不能实现函数的全部功能,进而导致卡顿)

##### 应用场景
**防抖**
防抖是指在一定时间内，如果连续触发同一事件，只会执行一次事件处理函数，并且是在最后一次事件触发之后一段时间开始执行。比如下拉加载更多，在用户频繁快速滚动的情况下，只有在用户停止滚动操作，并且停留一段时间后（如300毫秒），才会请求新数据。
使用场景:
* 输入框输入并触发搜索功能时；
* 窗口大小调整，调整结束后才更新布局
* 按钮多次点击，仅仅触发一次事件。

**节流**
节流是指在一定时间内，只能触发一次事件处理函数。比如鼠标连续滚动页面时，如果不加以控制，会造成页面不停的滚动，甚至卡顿。通过节流函数控制，能够让滚动事件的触发变得更加平滑。在这种情况下，事件处理函数会在指定时间内定时执行，将事件的触发频率限制为每隔一定时间响应一次，保证页面滚动的流畅性和减轻浏览器资源消耗和溢出。
使用场景:
* 鼠标不停地拖拽某个元素时；
* 页面滚动加载数据的情况下，滚动时数据量过大；
* 拖动元素变形或改变位置等，触发过程操作不发生过为间隔性的很小的操作。


##### 防抖原理
* 在事件<span style="color:red">触发 n 秒后才执行</span>;
* 如果你在一个事件触发的 n 秒内又触发了这个事件，以新的事件的时间为准，n 秒后才执行.
```javascript
function debounce(fn, wait) {
  let timeId
  return function() {
    clearTimeout(timeId)
    timeId = setTimeout(fn, wait)
  }
}

//2 version  修复this 与 事件对象传递
function debounce2(fn, wait) {
  let timeId
  return function() {
    if (timeId) clearTimeout(timeId)
    let thisArg = this
    let args = arguments
    timeId = setTimeout(() => fn.apply(thisArg, args), wait)
  }
}

//3 version 立即执行  
function debounce3(fn, wait, immediate) {
  let timeId
  return function() {
    let thisArg = this, args = arguments
    
    if (timeId) clearTimeout(timeId)
   	
    if (immediate) {  //这个立方总是理解不好
      let callNow = !timeId
      timeId = setTimeout(() => {timeId = null} , wait)
      if (callNow) fn.apply(thisArg, args)
    } else {
      timeId = setTimeout(() => {fn.apply(thisArg, args)}, wait)
    }
  }
}


//其他
/* 
实现函数防抖的函数
*/
function debounce(callback, delay) {
  return function (event) {
    console.log('debounce 事件...')
    
    // 清除待执行的定时器任务
    if (callback.timeoutId) {
      clearTimeout(callback.timeoutId)
    }
    // 每隔delay的时间, 启动一个新的延迟定时器, 去准备调用callback
    callback.timeoutId = setTimeout(() => {
      callback.call(this, event)
      // 如果定时器回调执行了, 删除标记
      delete callback.timeoutId
    }, delay)
  }
}


//使用案例
<span>节流input表单:</span><input id="inputNode" />
    
let inputNode = document.getElementById('inputNode');
function ajax(content){console.log('ajax request'+content)};

function debounce(callback,delay){
    //n秒内又触发,则会重新计时
    if(callback.timeoutId){ 
        clearTimeout(callback.timeoutId)
    }
    callback.timeoutId = setTimeout(()=>{
        callback(event);
        //callback.call(this,event)
        delete callback.timeoutId;
    },delay);  
}

let debounceAjax = debounce(ajax, 3000);
inputNode.addEventListener('keyup',function(e){
    debounceAjax(e.target.value)
})
```


##### 节流原理
<span style="color:red">每隔一段时间只执行一次事件</span>。
节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。
```js
//时间戳
function throttle(fn, wait) {
  let ctx, args;
  let start = 0
  return function() {
    let now = +new Date()
    ctx = this
    args = arguments
    
    if (now - start > wait) {
      fn.apply(ctx, args)
      start = now
    }
  }
}
//定时器
function throttle(fn, wait) {
  let timeId
  return function() {
    let thisArg = this
    let args = arguments
    
    if (!timeId) {
      timeId = setTimeout(() => {
        timeId = null
        fn.apply(thisArg, args)
      }, wait)
    }
  }
}

//比较两个方法：

//1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
//2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

//时间戳 + 定时器方案


/* 
实现函数节流的函数
*/

function throttle(callback, delay) {
  let start = 0 // 必须保存第一次点击立即调用
  return function (event) { // 事件回调函数
      // this是发生事件的dom元素
    console.log('throttle 事件')
    const current = Date.now()
    if (current - start > delay) { // 从第2次点击开始, 需要间隔时间超过delay
      callback.call(this, event)
      // 将当前时间指定为start, ==> 为后面的比较做准备
      start = current
    }
  }
}

<span>节流input表单:</span><input id="inputNode" />
    
let inputNode = document.getElementById('inputNode');
function ajax(content){console.log('ajax request'+content)}

function throttle(callback,delay){
    let start = 0;
    return function(event){
        let current = Date.now();
        if(current-start>delay){
            callback.call(this,event);  //用不用call, 不用
            start = current;
        }
    }
}

let throttleAjax = throttle(ajax,2000);
inputNode.addEventListener('keyup', function(e){
    throttleAjax(e.target.value)
})

```

### 深拷贝

##### 是什么
深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。

浅拷贝: 当我们把一个对象赋值给一个新的变量时，赋的其实是该对象的在==栈==中的地址，而不是堆中的数据。两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。

##### 浅拷贝
和深拷贝对应的浅拷贝,JS中的相关方法有:
* `[].slice(0)`
* `[].concat(arr)`
* 展开运算符
* Object.assign(obj1,obj2)

##### 深拷贝实现方式
* structuredClone
- JSON.parse(JSON.stringfy(obj)) 
  -  ===> 问题: 方法/函数会丢失(undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时)
  -  ===> 问题2: 循环引用会出错(死循环)
- 递归遍历
  - 如果是基本类型与函数直接返回, 函数就不会丢失也不会拷贝
  - 如果是对象/数组创建拷贝对象/数组
  - 问题: 循环引用会出错的问题(死循环)
- 使用Map缓存拷贝对象
  - 如果发现一个对象已经产生拷贝对象, 直接返回这人拷贝对象
  - 使用Map存储 ==> key为源对象, value是拷贝产生的对象  (不能用对象来存储, 因为对象的key为字符串)
- 库. lodash

```js
/* 
1). 大众乞丐版
    问题1: 函数属性会丢失   原因: json字符串数据是不存在函数, 函数属性就会丢失
    问题2: 循环引用会出错   原因: 转换为json字符串是会产生死循环查找, 报错
利用JSON转换成json字符串, 再解析回来
*/
deepClone1 (target) {
  if (target!==null && typeof target==='object' ) {
    return JSON.parse(JSON.stringify(target))
  } else {
    return target
  }
},
```


```javascript
//作者：神三元
//链接：https://juejin.cn/post/6844903986479251464
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
}

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if(!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if(!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag: 
      return new Object(Boolean.prototype.valueOf.call(target));
      // valueOf方法从对象中提取出其基本类型
      // new Object是为了创建了一个新的某某对象包装器
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag: //es6不推荐使用new,Symbol无法使用;所以使用valueOf
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag: 
    case dateTag:
      // Date对象，valueOf方法返回的是日期的毫秒表示,使用Object包装会变成数值类
      // Error`对象表示运行时错误，并且它们通常包含消息、堆栈追踪和其他属性。valueOf方法并不适用于获取Error对象的所有信息
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
}

const deepClone = (target, map = new WeakMap()) => {
  if(!isObject(target)) 
    return target;
  let type = getType(target);
  let cloneTarget;
  if(!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  }else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if(map.get(target)) 
    return target;
  map.set(target, true);

  if(type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if(type === setTag) {
    //处理Set
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
}
```


##### 复述一下深拷贝的操作流程:

* 定义函数,  参数(target, map=new WeakMap())
* 判断是否是对象(判断条件), 非对象直接返回
* 获取具体的对象类型
* 判断是否是 5种 可遍历的对象 (可遍历对象5个: Array/Object/Set/Map/Arguments)
  * 如果是不可遍历的对象, 声明外部函数`handleNotCanTraverse(target, type)`来处理
    * 一类: 调用原型上的`valueOf`方法获取原始值, 再使用`new Object()`生成包装类对象 (string / number / boolean /symbol )
    * 一类: 默认调用原型上的构造函数,生成新的对象 (date error)
    * 一类: 调用独立的方法来处理( 正则表达式, 函数)
  * 如果是可遍历的对象
    * 首先是:  通过`target.constructor`属性获取其构造函数, 调用构造函数生成相应的实例对象
    * 如果存在对象引用 , 会提前在函数的参数中添加`map = new WeakMap()` (这个地方不熟悉的话可以省略不说)
      * 存在对象引用: 直接返回这个对象; 
      * 当前对象不存在引用, 将当前对象添加进map集合中 `map.set(target, true)`
    * 如果是map类型
      * `cloneTarget.set(deepClone(key, map), deepClone(item, map))`
    * 如果是set类型
      * `cloneTarget.add(deepClone(item , map))`
    * 如果是对象 / 数组 类型, 使用`for...in`循环来处理
      * `cloneTarget[key] = deepClone(target[key], map)`

### 数组相关

##### 判断数据类型是否为数组的方案7种
* [] instanceof Array
* [].\_\_proto\_\_ === Array.prototype
* [].constructor === Array
* Array.prototype.isPrototypeOf([])
* Object.getPrototypeOf([]) === Array.prototype
* Object.prototype.toString.call([]).slice(8, -1)
* Array.isArray([])


##### 数组扁平化 7种
* toString + split
* flat
* JSON.stringify + replace + split / JSON.parse
* 递归
  * for ...of
  * reduce
* 展开运算符 + some 
```javascript
//toString + split

arr.toString().split(',')

//flat
arr.flat(Infinity)

//JSON + replace+split
//JSON.stringify(arr.replace(/\[|\]/g, '')).split(',')
JSON.stringify(arr).replace(/\[|\]/g, '').split(',')``

//JSON + replace + JSON.parse
let res = JSON.stringify(arr).replace(/\[|\]/g, '')
let newArr = JSON.parse('[' + res + ']')

//递归+for/reduce
let res = []
function flat(arr) {
  for (let i=0; i<arr.length; i++) { 
    if (Array.isArray(arr)) {
    	flat(arr[i])
  	} else {
      res.push(arr[i])
    }
  }
}
//
function flat(arr) {
  return arr.reduce((pre, crt) => {
    return pre.concat(Array.isArray(crt) ? flat(crt) : pre.concat(crt)
  }, [])
}
                    

//展开运算符
while(arr.some(Array.isArray)) {
    arr = [].concat(...arr)  // arr = [].concat(arr) 加不加展开运算符都一样的 多循环一次
  }
```


##### 实现flat
```javascript
//递归
// arguments.callee指向argumetns对象所在函数的指针, 实现函数名与逻辑的解耦
function flat(arr) {
  let res = []
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res = res.concat(arguments.callee(item)) 
      // res.push(...arguments.callee(item))
    } else {
      res.push(item)
    }
  })
  
  return res
}

//reduce
const flat = arr => {
  return arr.reduce((acc, crt) => {}, [
    return acc.concat(Array.isArray(crt) ? flat(crt) : crt)
  ])
}

//其他方法
```


##### 数组去重 7 种
* for + for  + splice
* for + for+ 新数组
* for + indexOf / includes
* reduce + indexOf/includes
* filter + indexOf / sort()
  * indexOf存在的问题
  * sort排序的问题  sort()排序有漏洞, 并不适用于特殊类型的排序. !!!!???
* sort快慢指针
* 键值对 
	* object键值对+filter(存在的问题: 不能去重正则表达式)
	* map键值对+filter
* new Set()
```javascript
let arr = [1,2,3,1,1,4,3,2,5,6,7];
// for + for 

for (let i=0; i<arr.length; i++) {
  for (let j=i+1; j<arr.length; j++) {
	  if (arr[j] === arr[i]) {
		  arr.splice(j, 1)
	    j--
	  }
  }
}

//for + 新数组

let newArr = []
let j;

for (let i=0; i<arr.length; i++) {
  for (j=0; j<newArr.length; j++) {
    if (arr[i] === newArr[j]) {
      break
    }
  }
  if (j === newArr.length) {
    newArr.push(arr[i])
  }
}

let newArr = [];
for (let i = 0, len = arr.length; i < len; i++) {
	let isDuplicate = false;
	for (let j = 0, len2 = newArr.length; j < len2; j++) {
		if (arr[i] === newArr[j]) {
			isDuplicate = true;
			break;
		}
	}
	if (!isDuplicate) {
		newArr.push(arr[i]);
	}
}
```


```javascript
//for + indexOf / includes

let res = []
for (let i=0; i<arr.length; i++) {
  if (res.indexOf(arr[i] === -1)) { // !res.includes(arr[i])
    res.push(arr[i])
  }
}
```


```javascript
// reduce + indexOf / includes

arr.reduce((pre, crt) => pre.includes(crt) ? pre : pre.concat(crt), [])
arr.reduce((pre, crt) => pre.indexOf(crt) === -1 ? pre.concat(crt) : pre, [])
```


```javascript
//filter + indexOf

arr.filter((item, idx, arr) => arr.indexOf(item) == idx)
//存在的问题
1.arr.indexOf(NaN)的结果是-1,所以会忽略NaN这个值.
2.对象不去重

arr.concat().sort().filter((item, idx, arr) => !idx || item !== arr[idx - 1])
```


```javascript
//sort快慢指针

//https://juejin.cn/post/6844904202162929671

function unique(arr) {
  arr.sort((a, b) => a - b);
  let left = 0,
      right = 1;
  
  while(right < arr.length) {
    if (arr[left] === arr[right]) {
      right++;
    } else {
      arr[left + 1] = arr[right];
      left++;
      right++;
    }
  }
  return arr.slice(0, left+1);
}

//https://juejin.cn/post/7033275515880341512
function unique2(arr) {
  arr.sort((a, b) => a - b);
  let slow = 1,
      fast = 1;
  
  while(fast < arr.length) {
    if (arr[fast - 1] !== arr[fast]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
```


```javascript
//object键值对

// 考虑到 `JSON.stringify` 任何一个正则表达式的结果都是 `{}`，所以这个方法并不适用于处理正则表达式去重。

let obj = {}
arr.filter( v => obj.hasOwnProerpty(v) ? false : (obj[typeof v + JSON.stringify(v)] = true))
```


```javascript
//map键值对

let map = new Map()
arr.fitler((item, idx, arr) => !map.has(item) && map.set(item, true))
```


```javascript
// set
let res = (arr) => [...new Set(arr)]
```

##### 数组去重存在的问题

重点关注下 对象 和NaN 的去重

| 方法                                                         | 结果                                                         | 说明                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- |
| for循环(双for+新数组)                                        | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| indexOf(作者用的是新数组+for循环+indexOf方法)                | [1, "1", null, undefined, String, String, /a/, /a/, NaN, NaN] | 对象和 NaN 不去重                       |
| sort<br />结论是数字1不去重,没有勘误.不知道是哪个数字1,是包装类的吗? | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 <br />数字 1 也不去重 |
| filter+indexOf                                               | [1, "1", null, undefined, String, String, /a/, /a/]          | 对象不去重 NaN 会被忽略掉               |
| filter+sort                                                  | [/a/, /a/, "1", 1, String, 1, String, NaN, NaN, null, undefined] | 对象和 NaN 不去重 数字 1 不去重         |
| 优化后的键值对方法                                           | [1, "1", null, undefined, String, /a/, NaN]                  | 全部去重                                |
| Set                                                          | [1, "1", null, undefined, String, String, /a/, /a/, NaN]     | 对象不去重 NaN 去重                     |


##### 数组翻转

1. 使用原型中的reverse方法

   ```js
   let array = [1, 2, 3, 4, 5]
   array.reverse() 
   ```
   
2. 循环
* 临时变量(索引之和等于长度减1)
* unshift
   ```js
   for(var i = 0; i < arr.length; i++){
       var temp = arr[i];
       arr[i] = arr[arr.length - 1 - i]
       arr[arr.length - 1 - i] = temp;
   }
   
   ```

   


##### 排序算法
> https://github.com/Easay/issuesSets/issues/44

###### 简单排序: 冒泡 / 选择 / 插入

```js
/* 
冒泡排序的方法
*/
function bubbleSort (array) {
  // 1.获取数组的长度
  var length = array.length;

  // 2.反向循环, 因此次数越来越少
  for (var i = length - 1; i >= 0; i--) {
    // 3.根据i的次数, 比较循环到i位置
    for (var j = 0; j < i; j++) {
      // 4.如果j位置比j+1位置的数据大, 那么就交换
      if (array[j] > array[j + 1]) {
        // 交换
        // const temp = array[j+1]
        // array[j+1] = array[j]
        // array[j] = temp
        [array[j + 1], array[j]] = [array[j], array[j + 1]];
      }
    }
  }

  return arr;
}

/* 
选择排序的方法
*/
function selectSort (array) {
  // 1.获取数组的长度
  var length = array.length

  // 2.外层循环: 从0位置开始取出数据, 直到length-2位置
  for (var i = 0; i < length - 1; i++) {
    // 3.内层循环: 从i+1位置开始, 和后面的内容比较
    var min = i
    for (var j = min + 1; j < length; j++) {
      // 4.如果i位置的数据大于j位置的数据, 记录最小的位置
      if (array[min] > array[j]) {
        min = j
      }
    }
    if (min !== i) {
      // 交换
      [array[min], array[i]] = [array[i], array[min]];
    }
  }

  return arr;
}

/* 
插入排序的方法
*/
// 插入排序实现
function insertionSort(arr) {
    // 对传入数组的拷贝进行排序，避免修改原数组
    const array = [...arr];
    
    // 从第二个元素开始遍历
    for (let i = 1; i < array.length; i++) {
        // 保存当前要插入的元素
        const current = array[i];
        let j = i - 1;
        
        // 将所有大于 current 的元素向右移动一位
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            j--;
        }
        
        // 在正确的位置插入当前元素
        array[j + 1] = current;
    }
    
    return array;
}
```


###### 快速排序

```js
function quickSort(arr) {
  // 递归结束的条件
  if(arr.length < 2){
    return arr
  }
  // 获取中间值
  let flag = Math.floor(arr.length / 2);
  let flagValue = arr.splice(flag, 1)[0];
  
  let leftArr = [];
  let rightArr = [];
  for (var i = 0; i < arr.length; i++) {
    var arrItem = arr[i];
    
    if(arrItem > flagValue){
      rightArr.push(arrItem)
    }else {
      leftArr.push(arrItem)
    }
  }
  
  leftArr = quickSort(leftArr);
  rightArr = quickSort(rightArr);
  return [...leftArr, flagValue, ...rightArr]
}
```

### 函数相关

##### 函数的call() / apply() / bind()

```javascript

//call
Function.prototype.call2 = function(...items) {
  let obj = items.shift() || globalThis
  let tempFn = Symbol()
  obj[tempFn] = this
  
  let res = obj[tempFn](...items)
  delete obj[tempFn]
  
  return res
}

// 不建议使用arguments
Function.prototype.myCall = function() {
  let obj = [].shift.call(arguments) || globalThis;
  obj.tempFn = this
  
  let res = obj.tempFn(...[...arguments]);
  delete obj.tempFn;
  return res;
}


//apply
Function.prototype.apply2 = function(...items) {
  let obj = items.shift() || globalThis
  obj[tempFn] = this
  let res = obj[tempFn](items)
  delete obj[tempFn]
  
  return res
}

//bind

//1 version
Function.prototype.bind = function(cxt) {
  let fn = this
  let argsOut = [].slice.call(arguments)
  return function() {
    let argsInner = [].slice.call(arguments)
    fn.apply(cxt, argsOut.concat(argsInner))
  }
}

//

//2 version  避免实例通过原型链更改函数原型上的属性,使用空函数中转 + 可以使用new调用
Function.prototype.bind = function () {
	let fn = this
  let argsOut = [].slice.call(arguments, 1)
  let fNOP = function() {}
  let fbound = function () {
    let argsInner = [].slice.call(arguments)
    return fn.apply(this instanceof fNOP ? this : crt, argsOut.concat(argusInner))
  }
  
  fNOP.prototype = this.prototype
  fbound.prototype = new fNOP()
  return fbound
}
```


```js
/* 
自定义函数对象的call方法
*/
function call (fn, obj, ...args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
自定义函数对象的apply方法
*/
function apply (fn, obj, args) {
  // 如果传入的是null/undefined, this指定为window
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  // 给obj添加一个方法: 属性名任意, 属性值必须当前调用call的函数对象
  obj.tempFn = fn
  // 通过obj调用这个方法
  const result = obj.tempFn(...args)
  // 删除新添加的方法
  delete obj.tempFn
  // 返回函数调用的结果
  return result
}

/* 
  自定义函数对象的bind方法
  重要技术:
    高阶函数
    闭包
    call()
    三点运算符
*/
function bind (fn, obj, ...args) {
  if (obj===null || obj===undefined) {
    obj = obj || window
  }
  
  return function (...args2) {
    call(fn, obj, ...args, ...args2)
  }
}
```

### 字符串处理

```js
/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/

/* 
1. 字符串倒序: reverseString(str)  生成一个倒序的字符串
*/
function reverseString(str) {
  // return str.split('').reverse().join('')
  // return [...str].reverse().join('')
  return Array.from(str).reverse().join('')
}

/* 
2. 字符串是否是回文: palindrome(str) 如果给定的字符串是回文，则返回 true ；否则返回 false
*/
function palindrome(str) {
  return str === reverseString(str)
}

/* 
3. 截取字符串: truncate(str, num) 如果字符串的长度超过了num, 截取前面num长度部分, 并以...结束
*/
function truncate(str, num) {
  return str.length > num ? str.slice(0, num) + '...' : str
}
```

### instanceof内部原理和实现

instanceof运算符判断一个对象是否为另一个对象的实例

```javascript

function isntanceof2(case, Ctor) {
    //基本数据类型返回false
  //兼容一下函数对象
  if (typeof(Case) !== 'object' && typeof(Ctor) !== 'function' || Case === 'null') {
    return false;
  }
  
  let caseProto = Object.getPrototypeOf(case)
  while(true) {
    if (caseProto == null) return false
    //找到相同的原型
    if (caseProto === Ctor.prototype) return true
    caseProto = Object.getPrototypeOf(caseProto)
  }
}


```

### 函数柯里化

> https://github.com/Easay/issuesSets/issues/78


函数柯里化是一种将接收多个参数的函数转换为接收一个参数并返回另一个函数的技术。更加灵活地控制函数的功能和输入。

##### 案例
考虑一个接收两个参数的函数，它将它们相乘并返回结果：
```js
function multiply(a, b) {
  return a * b;
}

multiply(2, 3);  // 6
```

使用柯里化转换函数
```js
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

multiply(2)(3);  // 6
```


##### 实现代码
```js
function curryIt(fn){
    var args = [];
    return function curried() {
        // 类数组转数组方式1：
        var arg = [].slice.call(arguments);
        // 方式2：
        //var arg = Array.from(arguments);
        args = args.concat(arg);
        if(args.length < fn.length){
            // return arguments.callee;
            return function () {
	            return curried.apply(this, args.concat(arguments))
            }
        }else{
            return fn.apply(null,args);
        }
    }   
}
```


##### 使用setTimeout实现setInterval
>https://github.com/Easay/issuesSets/issues/95
```js
function mySetInterval(fn, delay) {
	function interval() {
		setTimeout(interval, delay)
		fn()
	}
	setTimeout(interval, delay)
}

mySetInterval(() => console.log(1), 1000)


```
//实现clearInterval
```js
let id = 0
let timeMap = {}
const mySetInterval = (cb, time) => {
	let timeId = id;
	id++
	const fn = () => {
		cb()
		timeMap[timeId] = setTimeout(() => {fn()}, time)
	}
	timeMap[timeId] = setTimeout(fn, time)
	return timeId
}

function clearInterval(id) {
	clearTimeout(timeMap[id])
	delte timeMap[id]
}

let newId = mySetInterval(count, 1000)
setTimeout(() => clearInterval(newId), 3000)

function count() {
	console.log('a')
}
```


##### 实现一个准确的倒计时 ?
>https://github.com/Easay/issuesSets/issues/105


##### 实现curry() -(BEF.dev)
```js

function curry() {
	let 
}
```

### 高阶函数

##### 实现一个currying函数
> https://bigfrontend.dev/problem/implement-curry
```js
//错误方法
function curry(fn) {
	let args = []
	return function curried() {
		args.push(...arguments)
		if (args < fn.length) {
			return curried
		} else {
			return fn(...args)
		}
	}
}

//正确方法
function curry(fn) {
	return curried(...args) {
		let fnArgsLen = fn.length
		if (args.length < fnArgsLen) {
			return function(...moreArgs) {
				return curried.apply(this, args.concat(moreArgs))
			}
		} else {
			return fn.apply(this, args)
		}
	}
}
```

##### 按需求实现一个debounce函数
> https://bigfrontend.dev/problem/implement-basic-debounce

```js

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const debounced = debounce(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => debounced(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['C@5'])


function debounce(fn, delay) {
	let timeout
	return function(...args) {
		if (timeout) {
			clearTimeout(timeout)
		}

		
	}
}
```

## Demo

待补充：优先补深拷贝、防抖节流、`instanceof`、Promise 方法的可运行测试用例。
