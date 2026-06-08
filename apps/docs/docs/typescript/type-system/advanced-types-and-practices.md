# TypeScript 高级类型与工程实践

## 问题

泛型、高级类型、工具类型、类型保护、装饰器、声明文件、tsconfig、严格模式和工程实践怎么归类回答？

## 结论

这些题都属于 TypeScript 类型系统和工程实践，不应出现在 HTML 性能候选页里。可以按四层理解：

| 层级 | 内容 |
| --- | --- |
| 基础类型 | `string`、`number`、`boolean`、数组、元组、枚举、字面量类型 |
| 组合类型 | 联合、交叉、接口、类型别名、索引签名 |
| 类型运算 | 泛型、`keyof`、`typeof`、条件类型、映射类型、工具类型 |
| 工程实践 | `tsconfig`、`strict`、声明文件、JSDoc、测试、框架集成 |

泛型用于把类型作为参数传入，使函数、类、组件在复用时保持类型信息。

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

工具类型示例：

```ts
type UserPatch = Partial<User>;
type UserCard = Pick<User, 'id' | 'name'>;
type UserMap = Record<string, User>;
type PublicUser = Omit<User, 'password'>;
```

类型保护：

```ts
function isUser(value: unknown): value is User {
  return typeof value === 'object'
    && value !== null
    && 'id' in value
    && 'name' in value;
}
```

面试回答：

> TS 高级类型题可以按“组合类型、类型运算、工程实践”组织。泛型保留调用方的类型信息，`keyof` 取键集合，条件类型做类型级分支，映射类型批量变换属性，工具类型是常用变换的封装。工程上要打开 `strict`，对外部输入做运行时校验，并用声明文件或类型包描述第三方库。

## 参考来源

- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook: Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
