# 变量声明与基础类型

迁移自 `raw-notes/01_HTML&CSS&JS&TS.md`。

## 问题

- JavaScript
- 常规问题
- var/const/let的区别
- 声明变量的6种方式
- 对象
- 数组
- 函数

## 结论

以下内容先按原文完整迁移，仅做标题层级调整；精炼、去重、校准和 demo 化放到后续步骤。

### JavaScript

### 常规问题
#### var/const/let的区别
- const定义常量, let/var定义变量
- const和let相对于var
  - 有块作用域
  - 没有变量提升
  - 不会添加到window上
  - 不能重复声明

#### 声明变量的6种方式
>https://github.com/Easay/issuesSets/issues/113
* var
* let
* const
* function
* import
* class
##### 代码示例
代码1
```js
 function fun(str){
  let str = 'hello'+'world!';
  console.log(str);
}
fun('123');
```
结果：运行后是一个语法错误：Uncaught SyntaxError：Identifier 'code' has already been declared

代码二
```js
var str = 'hello';

function fun(){
  console.log(str);
  let str = 'world';
  console.log(str);
}
fun();
```
结果：只要块级作用域内存在let命令，它所声明的变量就“绑定”这个区域，不再受外部的影响，这也就是传说中的 暂时性死区，ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错，所以上面是一段错误代码：Uncaught ReferenceError: Cannot access 'str' before initialization。

代码三
```js
const obj = {};
let str = '坚持一周写两篇博客';
let addObj = obj.names = str;

console.log(addObj); //坚持一周写两篇博客
console.log(obj);{names:"坚持一周写两篇博客"}
```

const需要注意：
* 只声明不赋值，会报错；
* 只在声明所在的块级作用域内有效；
* const命令声明的常量不提升，存在暂时性死区；
* 不可重复声明；
* 冻结对象，可以使用Object.freeze方法


**function**
ES6规定：
允许在块级作用域内声明函数。
函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
同时，函数声明还会提升到所在的块级作用域的头部。
上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。

// 浏览器的 ES6 环境
```js
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```
**import**
import用于加载文件，在大括号接收的是一个或多个变量名，这些变量名需要与想要导入的变量名相同。

🌰：导入action.js文件中的某一个变量，这个变量里保存了一段代码块，所以要写成：import { Button } from 'action'，这个时候，就从action.js中获取到了一个叫 Button 的变量。

如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名，比如：
```js
import { NewButton as Button } from 'action.js';
```

**class**
```js
class Interest {
	constructor( x, y, e, z ){
		this.x = x;
		this.y = y;
		this.e = e;
		this.z = z;
	}

	MyInterest(){
		let arr = [];
		console.log(`我会${[...arr,this.x,this.y,this.e,this.z]}!`);
	}
}

let GetInterest = new Interest('唱','跳','rap','篮球');
console.log(GetInterest.MyInterest());  //我会唱,跳,rap,篮球!
```


#### **执行上下文**

##### 是什么
当 JavaScript 引擎执行一段可执行代码(executable code)时，会创建对应的执行上下文(execution context)。

每个执行上下文都有3个属性:
* 变量对象(Variable object，VO)
* 作用域链(Scope chain)
* this

#### 执行上下文栈

##### 定义

执行上下文栈（Execution context stack，ECS）来管理执行上下文
当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，当函数执行完毕的时候，就会将函数的执行上下文从栈中弹出。


#### 变量对象
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


#### 作用域
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


#### 对象


#### 数组

##### 数组遍历的方法有哪些?
* for循环
* while循环
* forEach
* for...of
* every/some reduce/map filter


#### 函数
##### 函数声明和函数表达式区别
* **函数名称是否必须**
	* 以函数声明的方法定义的函数,函数名是必须的
	* 函数表达式的函数名是可选的
* **函数是否提升**
	* 以函数声明的方法定义的函数,函数可以在函数声明之前调用
	* 函数表达式的函数只能在声明之后调用
* **使用范围**
	* 以函数声明的方法定义的函数并不是真正的声明,它们仅仅可以出现在全局中,或者嵌套在其他的函数中,但是<span style="color: blue">它们不能出现在循环/条件或try/catch/finally中</span>
	* 函数表达式可以在任何地方声明。换句话说，函数声明不是一个完整的语句，所以不能出现在if-else,for循环，finally，try catch语句以及with语句中。

```js
//（函数声明整体会被提升到当前作用域的顶部，函数表达式也提升到顶部但是只有其变量名提升）

// 函数表达式
console.log(expressionFunc); // 输出: undefined
// expressionFunc(); // 如果取消注释,会抛出 TypeError: expressionFunc is not a function

var expressionFunc = function() {
    console.log("This is a function expression");
};

```


##### call/apply/bind
###### bind能多次绑定一个函数吗?
可以多次绑定,但后续绑定不能覆盖已经指定的this值.

同样使用call/apply也无法改变绑定后函数的this值.

###### 手写bind方法
```js

Function.prototype.bind2 = function(...restArgs) {
	
	let obj = [].call.shift(restArgs) || globalThis
	let fn = this;

	return function() {
		let innerArgs = [].slice.call(arguments)
		return fn.apply(obj, restArgs.concat(innerArgs))
	}
	
}
```

###### 手写new方法
  >
  1.在内存中新建一个对象
>
>2.将新对象内部的[[prototype]]的指针赋值为构造函数的prototype属性
>
>3.更新构造函数内的this(Constructor.apply(obj))为这个对象, 并执行构造函数内部的代码,
>
>4.返回值: 如果构造函数返回非空对象,则返回该对象; 否则,返回刚创建的新对象.

```js

function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
```


#### 闭包
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


#### this

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

#### this在不同场景下的取值?

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


#### 原型链
##### 是什么
由相互关联的原型组成的<span style="color: blue">链状结构</span>

##### 原型对象
###### 定义
每一个JavaScript对象(null除外)在创建的时候就会<u>与之关联另一个对象</u>，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

##### 原型链查找规则概述
- 当我们要获取一个对象的属性时,浏览器会先在对象自身中寻找
- 如果有则直接使用,如果没有则去对象的原型中寻找
- 找到了则使用,没有则去原型的原型里去寻找.以此类推, 直到找到Object的原型,如果依然没有找到则返回undefined
- Object的原型是所有对象的原型,它的原型没有原型

##### 原型链图例
![原型与原型链结构图.png](https://i.loli.net/2021/03/31/mAWeRV3vnhjDM5B.png)


#### 继承

[[JS 继承和原型链#继承]]


#### 面向对象的3特征
- 封装:
  - 将可复用的代码用一个结构包装起来, 后面可以反复使用
  - js的哪些语法体现了封装性: 函数 ==> 对象 ==> 模块 ==> 组件 ==> 库
  - 封装都要有个特点: 不需要外部看到的必须隐藏起来, 只向外部暴露想让外部使用的功能或数据
- 继承
  - JS中的6种继承方式
- 多态: 多种形态
  - 理解
    - 声明时指定一个类型对象, 并调用其方法,
    - 实际使用时可以指定任意子类型对象, 运行的方法就是当前子类型对象的方法
  - JS中有多态:(去看class中的笔记)
    - 由于JS是弱类型语言, 在声明时都不用指定类型
    - 在使用时可以指定任意类型的数据 ==> 这已经就是多态的体现了


#### 防抖节流原理及应用

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


#### 白屏时间
白屏时间是指浏览器从输入网址，到浏览器开始显示内容的时间。

Performance 接口可以获取到当前页面中与性能相关的信息,该类型的对象可以通过调用只读属性 Window.performance 来获得。

performance.timing.navigationStart: PerformanceTiming.navigationStart 是一个返回代表一个时刻的 unsigned long long 型只读属性，为紧接着在相同的浏览环境下卸载前一个文档结束之时的 Unix毫秒时间戳。如果没有上一个文档，则它的值相当于 PerformanceTiming.fetchStart。

所以将以下脚本放在 `</head>` 前面就能获取白屏时间。

```html
<script>
	new Date() - performance.timing.navigationStart
</script>
```


#### 模块化

ES6模块的暴露和引入语法

暴露: 分别暴露, 对象暴露, 默认暴露

```javascript
// 分别暴露
export const a = 'a'
export const b = 'b'

//暴露对象
const c = 'c'
const d = 'd'
export {
	c,
  d as dd
}

//默认暴露
export default function foo() {}

```

引入: 通用引入; 解构赋值形式引入; 简便导入

```javascript
import * as m1from './m1'

//解构赋值形式引入
import {default as aaa} from 'xx.js'

//简便导入
import _ from 'lodash'
```


#### 异步

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


#### Promise

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


#### async/await
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


#### js的垃圾回收机制
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


### DOM/BOM
#### 事件(了解)

**事件是文档或者浏览器窗口中发生的，特定的交互瞬间。**

事件是用户或浏览器自身执行的某种动作，如click,load和mouseover都是事件的名字。

事件是javaScript和DOM之间交互的桥梁。

#### 事件流

##### 概述

事件流描述的是从页面中接收事件的顺序

##### 两种事件流模型

事件传播的顺序对应浏览器的两种事件流模型：捕获型事件流和冒泡型事件流

**冒泡型事件流**：事件的传播是从**最特定**的**事件目标**到最不特定的**事件目标**。即从DOM树的叶子到根。**【推荐】**

**捕获型事件流**：事件的传播是从**最不特定**的**事件目标**到最特定的**事件目标**。即从DOM树的根到叶子。


##### DOM事件流

DOM标准采用捕获+冒泡。两种事件流都会触发DOM的所有对象，从document对象开始，也在document对象结束

DOM标准规定事件流包括三个阶段：事件捕获阶段、处理目标阶段和事件冒泡阶段。
- 事件捕获阶段：**实际目标**（\<div>）在捕获阶段**不会接收事件**。也就是在捕获阶段，事件从document到\<html>再到\<body>就停止了。上图中为1~3.
- 处理目标阶段：事件在\<div>上发生并处理。**但是事件处理会被看成是冒泡阶段的一部分**。
- 冒泡阶段：事件又传播回文档。

事件捕获阶段,实际目标不会接收事件?
> 根据早期的DOM事件模型，实际目标元素在捕获阶段默认是不会处理事件的。这意味着，虽然事件会传递到目标元素，但是如果你没有明确地设置事件监听器在捕获阶段触发（在JavaScript中通过`addEventListener`的第三个参数设置为`true`），那么在捕获阶段，目标元素不会对事件做出响应。
> 事件进入目标阶段，在这个阶段，无论是否设置捕获，目标元素的事件监听器都会被触发。然后，事件开始冒泡阶段，它会沿DOM树向上传播，直到根节点。在冒泡阶段，如果父元素上有事件监听器设置为在冒泡阶段触发（通过`addEventListener`的第三个参数设置为`false`或不设置这个参数，因为默认值是`false`），那么这些监听器会被调用。


#### 事件绑定方式
- 嵌入dom
```js
<button onclick="func()">按钮</button>
```

- 直接绑定
```js
btn.onclick = function(){}
```

- 事件监听
```js
btn.addEventListener('click',function(){})
```


#### 事件冒泡
事件在传递给目标元素后, 会由内向外传递给外层的元素处理

#### 事件委托
* 事件委托利用了事件冒泡，不直接给多个子元素绑定多个事件监听, 而是给它们共同的父元素绑定一个监听
* 当操作任意子元素时, 事件会冒泡到父元素上处理
* 使用事件委托可以节省内存。
```javascript
<ul>
  <li>苹果</li>
  <li>香蕉</li>
  <li>凤梨</li>
</ul>

// good
document.querySelector('ul').onclick = (event) => {
  let target = event.target
  if (target.nodeName === 'LI') {
    console.log(target.innerHTML)
  }
}

// bad
document.querySelectorAll('li').forEach((e) => {
  e.onclick = function() {
    console.log(this.innerHTML)
  }
})
```


#### event.target/event.currentTarget
Event.target：指向触发事件的元素；
Event.currentTarget：指向绑定事件的元素。即添加事件监听器的元素。在事件传播过程中，它的值可能会发生改变。

当事件在DOM中传播时，event.target始终指向最初触发事件的元素，而event.currentTarget则随着事件的捕获或冒泡阶段而变化，指向当前处理事件的元素。

例如，如果你在一个ul元素上绑定了一个点击事件，并且点击了其中一个li子元素，那么event.target就是这个li元素，而event.currentTarget就是这个ul元素。

你可以利用event.target来实现事件委托，即通过在父元素上绑定一个事件处理函数来处理子元素的相同类型的事件。


#### 事件冒泡与事件委托

##### 1) 事件冒泡的流程
- 基于DOM树形结构
- 事件在目标元素上处理后, 会由内向外(上)逐层传递
- 应用场景: 事件代理/委托/委派

##### 2) 事件委托
- 减少内存占用(事件监听回调从n变为1)
- 动态添加的内部元素也能响应
- 不直接给多个子元素绑定多个事件监听, 而是给它们共同的父元素绑定一个监听
- 当操作任意子元素时, 事件会冒泡到父元素上处理
- 在事件回调中通过event.target得到发生事件的目标元素, 并进行相关处理


#### 封装一个绑定事件监听的函数

> [封装事件监听函数_巴拉巴拉小魔仙_的博客-CSDN博客](https://blog.csdn.net/m0_66637749/article/details/122708615)

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <button id="btn">按钮</button>
      <ul id="divBox">
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </div>
    <script>
      function bindEvent(ele, type, selector, fn) {
        if (fn == null) {
          fn = selector
          selector = null
        }

        ele.addEventListener(type, event => {
          const target = event.target
          if (selector) {
            // 代理绑定
            if (target.matches(selector)) {
              fn.call(target, event)
            }
          } else {
            // 普通绑定
            fn.call(ele, event)
          }
        })
      }


      // 普通绑定
      const btn = document.getElementById('btn')
      bindEvent(btn, 'click', function(e) {
        e.preventDefault();
        console.log(this)
        alert(this.innerText)
      })

      // 代理绑定
      const div = document.getElementById('divBox')
      bindEvent(div, 'click', 'li', function(e) {
        e.preventDefault()
        alert(this.innerText)
      })
    </script>
  </body>
</html>

```


#### DOM查找/添加/删除节点
##### 获取节点
* id
* class
* name
* tagName
* 查询

##### 获取/设置元素属性值
* element.getAttribute(attributeName)
* element.setAttribute(attributeName, attributeValue)


##### 创建节点
* document.createElement('h3')
* document.createTextNode(String) //创建文本节点
* document.createAttribute('class') //创建一个属性节点

##### 增添/替换/删除节点
* element.appendChild(Node) //再ele元素内部最后添加一个节点,参数是节点类型
* element.insertBefore(newNode, existingNode) //在ele内部中的existingNode前面插入newNode
* element.replaceChild() //替换子元素
* element.removeChild() //删除子元素

##### 删除节点
* element.removeChild(Node)


#### 前台数据存储

##### 存储方式
- cookie
- sessionStorage
- localStorage


##### localStoarge与sessionStorage比较
- 相同点:
  - 浏览器不能禁用, 请求时不会自动携带
  - 纯浏览器端存储, 
  - 只能保存文本, 如果是对象或数组, 需要转换为JSON
  - API相同:
    - setItem(key, value)
    - getItem(key, value)
    - removeitem(key, value)
- 不同点(关闭浏览器是否会被删除):
  - localStorage保存在本地文件中, 除非编码或手动删除, 否则一直存在
  - sessonStorage数据保存在当前会话内存中, 关闭浏览器则清除

##### sessionStorage同源跨窗口可以共享吗?
只有在本页面中以新页签或窗口打开的同源页面会‘临时复制’之前页面的sessionStorage。
a标签也是同样的效果


##### cookie与localStorage和sessionStorage比较
都是浏览器提供的用于存储数据的技术
* **存储大小不同**：cookie一般只能存储4KB左右的数据，而localStorage和sessionStorage可以存储更大的数据，一般为5MB或更多。
* **数据有效期不同**：cookie可以设置过期时间，如果没有设置，则在浏览器关闭时失效；localStorage始终有效，除非用户手动清除；sessionStorage只在当前浏览器窗口关闭前有效。
* **作用域不同**：cookie在所有同源窗口中都是共享的，并且会随着每次HTTP请求发送到服务器；localStorage也在所有同源窗口中共享，但不会发送到服务器；sessionStorage一般不在不同的浏览器窗口中共享。
* **数据安全性不同**：cookie相对较容易被篡改或窃取，因此不适合存储敏感信息；localStorage和sessionStorage相对较安全，但仍然可能受到XSS攻击

##### cookie与session比较
cookie和session都是用来记录客户状态的机制，但它们有以下几个区别：
* 存储位置不同：cookie数据存放在客户端浏览器中，session数据存放在服务器上。
* 安全性不同：cookie相对较容易被篡改或窃取，因此不适合存储敏感信息；session相对较安全，因为它只能通过特定的sessionID来访问。
* 服务器性能不同：session会占用服务器的内存资源，如果访问量过大，可能会影响服务器的性能；cookie则不会给服务器增加负担。
* 存储容量和有效期不同：单个cookie保存的数据一般不能超过4KB，而且一个站点最多只能保存20个cookie；session则没有明确的上限，但出于对服务器性能的考虑，应该尽量精简和及时删除无用的session。
* 有效期: cookie可以设置过期时间，如果没有设置，则在浏览器关闭时失效；session也有一定的有效期，一般为30分钟，如果超过这个时间没有活动，则会自动失效.

### 常规问题

##### 初始化CSS原因? 
- 因为浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。
- 当然，初始化样式会对 SEO 有一定的影响，但鱼和熊掌不可兼得，但力求影响最小的情况下初始化。
- 最简单的初始化方法： `* { padding: 0; margin: 0; }` （强烈不建议）
- 使用 `normalize.css`
##### min-width, max-width,width的包含关系(优先级)是什么?
**属性的含义：**
- `min-width` 限制元素的最小宽度
- `max-width` 限制元素的最大宽度
- `width` 元素的宽度
**三者之间的优先级：**
`min-width` 和 `max-width` 的优先级都高于 `width`。即使 `width` 后面加上 `!important`。
- 当浏览器缩小导致元素宽度小于 `min-width` 时，元素的 `width` 就会被 `min-width` 的值取代，浏览器出现滚动条来容纳元素。
- 当浏览器放大导致元素的宽度大于 `max-width` 时，元素的 `width` 就会被 `max-width` 值取代。
- 当 `min-width` 值大于 `max-width` 时，则以 `min-width` 值为准。
**所以三者优先级排序： min-width > max-width > width**

### var/const/let的区别

- const定义常量, let/var定义变量
- const和let相对于var
  - 有块作用域
  - 没有变量提升
  - 不会添加到window上
  - 不能重复声明

### 声明变量的6种方式

>https://github.com/Easay/issuesSets/issues/113
* var
* let
* const
* function
* import
* class
##### 代码示例
代码1
```js
 function fun(str){
  let str = 'hello'+'world!';
  console.log(str);
}
fun('123');
```
结果：运行后是一个语法错误：Uncaught SyntaxError：Identifier 'code' has already been declared

代码二
```js
var str = 'hello';

function fun(){
  console.log(str);
  let str = 'world';
  console.log(str);
}
fun();
```
结果：只要块级作用域内存在let命令，它所声明的变量就“绑定”这个区域，不再受外部的影响，这也就是传说中的 暂时性死区，ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错，所以上面是一段错误代码：Uncaught ReferenceError: Cannot access 'str' before initialization。

代码三
```js
const obj = {};
let str = '坚持一周写两篇博客';
let addObj = obj.names = str;

console.log(addObj); //坚持一周写两篇博客
console.log(obj);{names:"坚持一周写两篇博客"}
```

const需要注意：
* 只声明不赋值，会报错；
* 只在声明所在的块级作用域内有效；
* const命令声明的常量不提升，存在暂时性死区；
* 不可重复声明；
* 冻结对象，可以使用Object.freeze方法


**function**
ES6规定：
允许在块级作用域内声明函数。
函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
同时，函数声明还会提升到所在的块级作用域的头部。
上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当作let处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于var声明的变量。

// 浏览器的 ES6 环境
```js
function f() { console.log('I am outside!'); }
(function () {
  var f = undefined;
  if (false) {
    function f() { console.log('I am inside!'); }
  }

  f();
}());
// Uncaught TypeError: f is not a function
```
**import**
import用于加载文件，在大括号接收的是一个或多个变量名，这些变量名需要与想要导入的变量名相同。

🌰：导入action.js文件中的某一个变量，这个变量里保存了一段代码块，所以要写成：import { Button } from 'action'，这个时候，就从action.js中获取到了一个叫 Button 的变量。

如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名，比如：
```js
import { NewButton as Button } from 'action.js';
```

**class**
```js
class Interest {
	constructor( x, y, e, z ){
		this.x = x;
		this.y = y;
		this.e = e;
		this.z = z;
	}

	MyInterest(){
		let arr = [];
		console.log(`我会${[...arr,this.x,this.y,this.e,this.z]}!`);
	}
}

let GetInterest = new Interest('唱','跳','rap','篮球');
console.log(GetInterest.MyInterest());  //我会唱,跳,rap,篮球!
```

### 对象

### 数组

##### 数组遍历的方法有哪些?
* for循环
* while循环
* forEach
* for...of
* every/some reduce/map filter

### 函数

##### 函数声明和函数表达式区别
* **函数名称是否必须**
	* 以函数声明的方法定义的函数,函数名是必须的
	* 函数表达式的函数名是可选的
* **函数是否提升**
	* 以函数声明的方法定义的函数,函数可以在函数声明之前调用
	* 函数表达式的函数只能在声明之后调用
* **使用范围**
	* 以函数声明的方法定义的函数并不是真正的声明,它们仅仅可以出现在全局中,或者嵌套在其他的函数中,但是<span style="color: blue">它们不能出现在循环/条件或try/catch/finally中</span>
	* 函数表达式可以在任何地方声明。换句话说，函数声明不是一个完整的语句，所以不能出现在if-else,for循环，finally，try catch语句以及with语句中。

```js
//（函数声明整体会被提升到当前作用域的顶部，函数表达式也提升到顶部但是只有其变量名提升）

// 函数表达式
console.log(expressionFunc); // 输出: undefined
// expressionFunc(); // 如果取消注释,会抛出 TypeError: expressionFunc is not a function

var expressionFunc = function() {
    console.log("This is a function expression");
};

```


##### call/apply/bind
###### bind能多次绑定一个函数吗?
可以多次绑定,但后续绑定不能覆盖已经指定的this值.

同样使用call/apply也无法改变绑定后函数的this值.

###### 手写bind方法
```js

Function.prototype.bind2 = function(...restArgs) {
	
	let obj = [].call.shift(restArgs) || globalThis
	let fn = this;

	return function() {
		let innerArgs = [].slice.call(arguments)
		return fn.apply(obj, restArgs.concat(innerArgs))
	}
	
}
```

###### 手写new方法
  >
  1.在内存中新建一个对象
>
>2.将新对象内部的[[prototype]]的指针赋值为构造函数的prototype属性
>
>3.更新构造函数内的this(Constructor.apply(obj))为这个对象, 并执行构造函数内部的代码,
>
>4.返回值: 如果构造函数返回非空对象,则返回该对象; 否则,返回刚创建的新对象.

```js

function newOperator() {
  let obj = {};
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype; 
  //let obj = Object.create(Constructor.prototype);
  let result = Constructor.apply(obj, arguments);
  return typeof result === 'object' ? result : obj;
}
```

## Demo

待补充：展示 `var` 的函数作用域、`let/const` 的块级作用域、暂时性死区和 `const` 对象属性修改。
