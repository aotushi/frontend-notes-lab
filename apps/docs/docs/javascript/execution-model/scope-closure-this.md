# 执行上下文、作用域、闭包与 this

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- 执行上下文
- 执行上下文栈
- 变量对象
- 作用域
- 闭包
- this
- this在不同场景下的取值?

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### 执行上下文

##### 是什么
当 JavaScript 引擎执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

每个执行上下文都有3个属性:
* 变量对象(Variable object，VO)
* 作用域链(Scope chain)
* this

### 执行上下文栈

##### 定义

执行上下文栈（Execution context stack，ECS）来管理执行上下文
当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。

### 变量对象

##### 是什么
变量对象是与执行上下文相关的<span style="color:red">数据作用域</span>，存储了在上下文中定义的变量和函数声明。在函数被调用但是函数尚未被执行时被创建的.创建过程实际上就是函数初始化的过程.
全局上下文中的变量对象就是全局对象
函数上下文中的变量对象(活动对象)是进入函数上下文时被创建的

##### 变量对象的组成
执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：
1. 进入执行上下文
2. 代码执行
当进入执行上下文时，这时候还没有执行代码，
变量对象会包括：
1. 函数的所有形参 (如果是函数上下文)
   - 创建由名称和对应值组成的一个变量对象的属性
   - 没有实参，属性值设为 undefined
2. 函数声明
   - 创建由名称和对应值（函数对象(function-object)）组成一个变量对象的属性
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
3. 变量声明
   - 创建由名称和对应值（undefined）组成一个变量对象的属性
   - <span style="color:blue">如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性</span>

##### 变量对象实例
```javascript
function foo(a) {
  var b = 2;
  function c() {}
  var d = function() {};

  b = 3;

}

foo(1);
```

在进入执行上下文后，这时候的 AO 是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to function c(){},
    d: undefined
}
```

代码执行:
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值
还是上面的例子，当代码执行完后，这时候的 AO 是：
```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

### 作用域

##### 产生的背景
将变量引入程序带来的问题: 变量存储在哪里? 程序需要的时候如何找到它们?
##### 是什么
存储变量和查找变量的规则.

##### 变量查找案例 (`var a = 2`)

以`var a = 2`为例:
* 首先, 编译器会将这段程序分解成词法单元，然后将词法单元解析成一个树结构。
* 遇到`var a`，<span style="color:blue;">编译器会询问作用域</span>是否在同作用域集合中存在同名变量
  * 是 编译器会忽略该声明，继续进行编译；
  * 否 它会要求作用域在当前作用域的集合中声明一个新的变量，并命名为a
* 编译器为引擎运行生成所需的代码,用来处理a=2这个赋值操作.<span style="color:blue;">引擎运行时会首先询问作用域</span>，在当前的作用域集合中是否存在一个叫作`a`的变量。
  * 是, 引擎就会使用这个变量
  * 否, 引擎会继续查找该变量
    * 找到, 就会将2赋值给它;
    * 没找到, 引擎就会举手示意并抛出一个异常 ?!!

##### 引擎查找变量两套规则

查找变量的两种查询方式:
- LHS查询  “赋值操作的目标是谁（LHS） 一般出现在赋值操作的左侧
- RHS查询  “谁是赋值操作的源头（RHS）”  一般出现在赋值操作的右侧

##### 查询未声明变量的处理过程
在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，这两种查询的行为是不一样的。具体表现如下:
- RHS查询遍寻不到所需的变量,引擎会抛出`ReferenceError`异常
- LHS查询遍寻不到所需变量,
  - 非严格模式: 全局作用域会创建一个具有该名称的变量,并返还给引擎(非'严格模式'下)
  - 严格模式: 抛出同RHS查询失败时类似的`ReferenceError`异常
- RHS查询找到一个变量,但对变量进行不合理操作(例如,对函数类型进行调用,引用null/undefined值中的属性), 引擎抛出`TypeError`.

> `ReferenceError` 同作用域判别失败相关
> `TypeError` 代表作用域判别成功了，但是对结果的操作是不合法的


##### 作用域的两种类型

作用域共有两种主要的工作模型。
- 词法作用域: 最为普遍的，被大多数编程语言所采用的。<span style="color:blue;">词法作用域就是定义在词法阶段的作用域</span>。
- 动态作用域，仍有一些编程语言在使用（比如Bash脚本、Perl中的一些模式等）


##### JS中的作用域类型
* 全局作用域
* 函数作用域
* 块作用域

##### JS函数作用域的特点

> 在某个位置独立调用,将会局部提升

* 函数的作用域由函数的<u>定义位置决定</u>,和函数的调用位置无关
* 函数作用域在函数调用时<u>创建</u>，在调用结束时<u>销毁</u>  
* 函数每次调用都会产生一个<u>新的</u>函数作用域，函数作用域之间<u>相互独立</u>
* 在函数作用域中声明的变量是<u>局部变量</u>,只能在函数内部访问; 省略var或let，则变量默认会成为<u>全局</u>变量(不希望出现的情况)
* 在函数内部，使用var声明的变量和使用function开头的函数也会被<u>提升</u>


##### JS中的块作用域有哪些?

<u>with</u>

用with从对象中创建出的作用域仅在with声明中而非外部作用域中有效。

<u>try...catch</u>

其中声明的变量仅在catch内部有效

<u>let</u>

let关键字可以将变量绑定到所在的任意作用域中（通常是{ .. }内部）。换句话说，let为其声明的变量<span style="color:blue;">隐式地劫持了所在的块作用域</span>


##### JS块作用域的作用

1.作用域作用-垃圾回收

让引擎清楚地知道没有必要继续保存某些数据

```javascript
function process(data) {
  //...
}
{ //在这个块中定义的内容完事可以销毁
	var someReallyBigData = {};
	process(someReallyBigData);
}

//
```

<u>2.let循环</u>

<span style="color:blue">for循环头部的let不仅将i绑定到了for循环的块中，事实上它将其重新绑定到了循环的每一个迭代中，确保使用上一个循环迭代结束时的值重新进行赋值。</span>

下面通过另一种方式来说明每次迭代时进行重新绑定的行为：

```javascript
{
  let j;
  for (j=0; j<10; j++) {
    let i=j; //每个迭代重新绑定
    console.log(i);
  }
}

//说明了几件事情?
//1. for循环内存在块作用域
//2. let声明的变量会绑定到循环的每一次迭代中
```

<u>3.创建块作用域变量</u>

可以用来创建块作用域变量，但其值是固定的（常量）。之后任何试图修改值的操作都会引起错误。

4.基于作用域隐藏变量和函数


##### 作用域嵌套

是什么?
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域的嵌套。

查找规则?
引擎从当前的执行作用域开始查找变量，如果找不到，就向上一级继续查找。当抵达最外层的全局作用域时，无论找到还是没找到，查找过程都会停止。

##### 作用域链

定义
由多个执行上下文的<u>变量对象</u>构成的链表叫做作用域链. 当查找变量时,会,就会,全局....

### 闭包

![image](https://jsd.cdn.zzko.cn/gh/aotushi/image-hosting@master/documentation/image.7g1aiggs0g00.webp)
##### 定义
闭包是一个函数以及其周围状态（词法环境）的引用的组合。简单说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。

##### 形成原因
存在上级作用域的引用
当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

##### 如何创建
- 嵌套的内部函数引用了外部函数的变量, 当调用外部函数并执行返回的内部函数

##### 优点
- 保护函数的私有变量不受外部干扰,实现方法或属性的私有化
- 形成不被销毁的栈内存

##### 缺点
* 内存泄露: 程序申请了内存,但没有及时释放,导致内存空间被浪费
* 内存溢出: 程序申请的内存超过系统提供的上限,导致无法分配内存.

##### 使用场景
* 数据私有化
* 函数工厂
* 实现模块化
闭包使用场景包括: 使用return返回函数; 函数作为参数; IIFE; 定时器setTimeout; 所有的回调函数.

1.回调
闭包有用之处在于它可以将一些数据和操作它的函数关联起来。这和面向对象编程明显相似。在面对象编程中，我们可以将某些数据（对象的属性）与一个或者多个方法相关联。(在<span style="color:red">定时器, 事件监听器,Ajax请求,跨窗口通信,Web Works或者其他的异步(或同步)任务</span>中,<span style="color:blue;"> 只要使用了回调函数,实际上就是在使用闭包.</span>)
因此，当你想只用一个方法操作一个对象时，可以使用闭包。

2.模拟私有方法
私有方法不仅可以限制代码的访问权限，还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口。


##### 闭包实例

###### 简述函数执行过程
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
foo();
```

简要复述其执行过程:

1. 进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
2. 全局执行上下文初始化
3. 执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
4. checkscope 执行上下文初始化，创建变量对象、作用域链、this等
5. checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
6. 执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
7. f 执行上下文初始化，创建变量对象、作用域链、this等
8. f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

问题:

当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

<span style="color:red"> f 执行上下文维护了一个作用域链</span>：


###### 实现一个只能执行3次的函数
有一个函数，参数是一个函数，返回值也是一个函数，返回的函数功能和入参的函数相似，但这个函数只能执行3次，再次执行无效，如何实现

```javascript
function sayHi() {
    console.log('hi')
}

function threeTimes(fn) {
    let times = 0
    return () => {
        if (times++ < 3) {
            fn()
        }
    }
}

const newFn = threeTimes(sayHi)
newFn()
newFn()
newFn()
newFn()
newFn() // 后面两次执行都无任何反应
```


###### 实现add函数,让add(a)(b)和add(a,b)两种调用结果相同

```javascript
function add(a, b) {
  if (b === undefined) {
    return function(x) {
       return a + x
    }
  }
  
  return a + b
}
```


##### 闭包面试题

1.for循环
```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0](); //输出3
data[1](); //输出3
data[2](); //输出3
```

如何改造:
* 立即执行函数
* 使用let
```js
var data = []
for (var i=0; i<3; i++) {
	//data[i] = (function() {console.log(i)})(i) 错误
	data[i] = (function(j){console.log(j)})(i)
}


//let
var data = []
for (let i=0; i<3; i++) {
	console.log(i)
}
```


##### 其它
###### IIFE是闭包吗?

```javascript
var a = 2;
(function IIFE() {
  console.log(a);
})();
```

以上代码并不是严格的闭包:
* 因为函数（示例代码中的IIFE）并不是在它本身的词法作用域以外执行的。它在定义时所在的作用域中执行
* a是通过普通的词法作用域查找而非闭包被发现的。


###### 循环和闭包
```javascript
for (var i=1; i<=5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i*1000)
}
```

延迟函数的回调会在循环结束时才执行. 即使每个迭代中执行的setTimeout(..., 0), 所有的回调函数依然是在循环结束后才被执行.

**代码的问题:**

我们试图假设循环中的每个迭代在运行时都会给自己“捕获”一个i的副本。<u>但是根据作用域的工作原理，实际情况是尽管循环中的五个函数是在各个迭代中分别定义的，但是它们都被封闭在一个共享的全局作用域中，因此实际上只有一个i。</u>

解决:

IIFE解决方案:
```javascript
//正确代码
for (var i=1; i<=5; i++) {
  (function() {
    var j = i;
    setTimeout(function timer() {
      console.log(j);
    }, j*1000)
  })()
}
//改进
for (var i=1; i<=5; i++) {
  (function() {
    setTimeout(function timer() {
      console.log(i);
    }, i*1000)
  })(i);
}
```

使用let代替IIFE
使用let声明来代替IIFE创建新的作用域
```javascript
for (var i=1; i<=5; i++) {
  let j=i; //闭包的块作用域
  setTimeout(function timer() {
    console.log(j);
  }, j*1000);
}
```


###### 模块
通过在模块实例的内部保留对公共API对象的内部引用，可以从内部对模块实例进行修改，包括添加或删除方法和属性，以及修改它们的值。
* 接收参数
* 命名将要作为公共API返回的对象

```javascript
var foo = (function CoolModule(id) {
  function change() {
    //修改公共API
    publicAPI.identify = identify2;
  }
  
  function identify1() {
    console.log(id);
  }
  
  function identify2() {
    console.log(id.toUpperCase());
  }
  
  var publicAPI = {
    change: change,
    identify: identify1
  };
  
  return publicAPI;
})('foo module');

foo.identify(); //'foo module'
foo.change();
foo.identify(); //'FOO MODULE'
```

其他后续内容, 笔记中记录的比较详细, 面试就说到这里吧

### this

##### 介绍
* 执行上下文的一个属性
* 是在运行时进行绑定的,和函数声明的位置无关.

##### 使用原因
* 显式传递上下文对象会让代码越来越混乱
* 调用函数时候不用传递上下文对象, this隐式传递一个对象引用,API简洁易于复用

##### 绑定规则
* 默认绑定
  * 非严格模式下,函数直接调用,this绑定到window/globalThis; 严格模式下,this是undefined
* 隐式绑定
  * 调用位置上是否有上下文对象或者说是否被某个对象拥有或包含.(注意: 函数不属于对象,从作用域上来解释)
  * 规则:
    * 当引用函数有上下文对象时,隐式规则会把this绑定到上下文对象
    * <span style="color:red">对象属性引用链中只有最后一层在调用位置中起作用</span>
  * 存在的问题: 
    * 隐式丢失: 丢失绑定对象,会应用默认绑定.
	  * 隐式丢失 几种情况
	    * 将`对象.方法`赋值给变量,调用这个变量
	    * 参数传递, 将函数是通过参数传递进函数
	    * 把函数传入语言内置的函数
	  * 隐式绑定存在问题
	    * 隐式丢失中,无法控制回调函数的执行方式,也就无法控制调用位置以得到期望的值
	    * 如何解决？ 固定this

* 显式绑定
  * 不想在对象内部包含函数引用，而想在某个对象上强制调用函数。  使用call/apply/bind
  * 如果call/apply第一个参数传入原始值？？
    * 装箱  基本类型转成它的对象形式
  * 显示绑定存在的问题（理解）
    * 虽然call和apply可以在任意地方调用,但是它是直接进行调用送的.设想,如果在某个第三方库中,其异步的回调函数需要改变this,如果这个时候使用call/apply会立即调用并更改this,异步在不知道完成与否的情况下,异步回调直接运行了.
* new绑定

使用new来调用函数,或者说发生构造函数调用时,会自动执行下面的操作:
1. 内存中新建一个对象
2. 将构造函数的原型prototype赋值给新建对象的隐式原型[[prototype]]指针
3. 执行函数,并将函数的this更改为这个对象
4. 如果函数返回非空对象,则返回;否则,返回新建对象.
```js
//隐式绑定丢失
//把函数传如语言内置的函数
function foo() {
  console.log(this.a)
}

var obj = {
  a:2,
  foo: foo
}

var a = 'oops, global!'
setTimeout(obj.foo, 100); //'oops, global'
//js内置的setTimeout函数和下面的伪代码类似
functionsetTimeout(fn, delay) {
  //delay
  fn()
}
```

```js
// new绑定

const newFn = () => {
	let obj = {}
	let fn = arguments[0]
	let args = [].slice.call(arguments, 1)
	obj.__proto__ = fn.prototype
	let res = fn.call(obj, args)
	return typeof res === 'object' ? res : obj
}


function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}

function createObject(ctor) {
  let obj = Object.create(null);
  Object.setPropertyOf(obj, ctor.prototype);
  // 上面的两步可以合并为一步: obj = Object.create(ctor.prototype)
  
  const res = ctor.apply(obj, [].slice.call(arguments, 1));
  
  return typeof(res) === 'object' ? res : obj;
}
```

### this在不同场景下的取值?

- 常规情况下, 函数中的this取决于执行函数的方式
  - fn(): 直接调用  ==> **this是?**  window
  - new fn(): new调用 ==> **this是?**  新建的对象
  - obj.fn(): 通过对象调用 ==> **this是?**  obj
  - fn.call/apply(obj): 通过函数对象的call/apply来调用 ==> **this是?**  obj

- 特殊情况:
  - bind(obj)返回的函数  ==> **this是?**  obj
  - 箭头函数 ==> **this是?**  外部作用域的this
  - 回调函数
    - 定时器/ajax/promise/数组遍历相关方法回调  ==> **this是?**  window 或 当前的事件源
    - vue控制的回调函数  ==> **this是?**  组件的实例
    - React控制的生命周期回调, 事件监听回调  ==>  **this是?**  组件对象 / undefined

- 如何控制函数的this?  
  - 利用函数的bind()
  - 利用箭头函数
  - 也可以用外部保存了this的变量

## Demo

待补充：展示作用域链查找、闭包保留变量、普通函数和箭头函数的 `this` 差异。
