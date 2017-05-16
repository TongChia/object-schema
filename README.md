ObjectSchema
===
Object schema validation for database and express(koa)


### Features
- [ ] Field
  - [ ] defines
    - [x] type
    - [ ] enum
    - [x] default
    - [x] required
    - [x] validate 
      - [x] RegExp
      - [x] function (async)
      - [x] Promise
    - [ ] errorMessage
      - [ ] Error
      - [ ] *template
  - [ ] *内置验证器
    - [x] isConstructor
    - [ ] isObjectId
    - [ ] 整合chriso/validator.js的验证器
    - [ ] *lodash/lang
  - [x] verify 方法
    - [x] async (callback(err, result))
    - [x] promise 
    - [ ] *use nodeJs assert
- [ ] Schema
  - [ ] defines
    - [x] create Fields
    - [ ] default
    - [ ] errorMessage
  - [x] verify 方法
    - [x] async (callback(err, result))
    - [x] promise
- [ ] 数据校验
  - [ ] *主动验证 如果参数错误 throw Error.
  - [ ] 被动验证 调用 .verification() 方法时 return Error (包含错误字段).
- [ ] 格式化数据
  - [ ] 多格式的统一格式 (如: [Number|String] => [Number])
  - [ ] 自定义格式化方法
- [ ] 作为 Express/Koa 中间件, 验证参数准确性.
  - [ ] 直接返回 error, 可指定错误代码和格式(json / html ...). 
  - [ ] 返回错误到 context (req).
  - [ ] 格式化数据并传入 context (req).


### GUIDE
```js
/*================= Field ===================*/
// 对象形式, 如:
var name = Field({type: String, default: 'hello', verify: /^\w+$/, enum: ['Tom', 'Jerry']});
// 数组形式, 如:
[String, 'hello', /hello/]
// 简单, 如:
String
// SubDoc, 如:
[String]
[{type: Number, default: 0}]

// create field with new or not
var name = Field({type: String, validator: /^[a-z]+$/});
var age = new Field({type: Number, default: 0});
// => [ Field {type: [Function Number]} ]
// .
/*================= Schema ===================*/
var book = new Schema({
  title: [String, /^[a-zA-Z ]{4,30}$/],
  author: {
    name: String,
    sex: [Int32, [0, 1, 2]]
  },
  years: Date
});

book.verify({
  title: 'Don Quixote',
  author: {
    name: 'Miguel de Cervantes Saavedra',
    sex: 4
  }
}).then(console.log, console.error);

var person = new Schema({
  name: name,
  age: {type: Number, validator: (v) => (v > 0 && v < 100)},
  nickname: [fieldName],
  books: [book],
  pets: [{name: String, age: Number}]
});
```
