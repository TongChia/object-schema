const {Int32, Long, Double} = require('mongodb');
const Schema = require('../lib/schema');
const Field = require('../lib/field');

require('chai').should();



// var book = new Schema({
//   title: [String, /^\w{5,30}$/],
//   author: {
//     name: String,
//     sex: [Int32, [0, 1, 2], function (v) {
//       // console.log(this);
//       return v === 1;
//     }]
//   },
//   years: Date
// });
// console.log(book);
// console.log('///////////////');
// console.log(book.author.sex);
// console.log(book.author.sex.validate);
// book.title.verify('AAA/').then(console.log).catch(console.error);

// book.verify({
//   title: 'abbbb',
//   author: {
//     name: 'asdasd',
//     sex: 2
//   }
// }).then(console.log, console.log);
//
// var fieldName = new Field([String, /^\w+$/, true]);
//
// var person = new Schema({
//   name: fieldName,
//   age: {type: Number, validator: (v) => (v > 0 && v < 100)},
//   nickname: [fieldName],
//   books: [book],
//   pets: [{name: String, age: Number}]
// });
// console.log('///////////////');
// console.log(person);
// console.log('///////////////');
// console.log(person.books[0].author.name);

