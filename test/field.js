const {Int32, Long, Double} = require('mongodb');
const Schema = require('../lib/schema');
const Field = require('../lib/field');

require('chai').should();

describe('Field Test', () => {
  
  let field1, field2, field3;
  
  it('Create field with define object', () => {
    field1 = new Field({type: String});
    field1.should.be.instanceOf(Field);
  });
  
  it('Create field with define array', () => {
    field2 = new Field([String]);
    field2.should.be.instanceOf(Field);
  });
  
  it('Create field with define constructor', () => {
    field3 = new Field(String);
    field3.should.be.instanceOf(Field);
  });
  
  it('3 field should be equal', () => {
    field1.should.deep.equal(field2);
    field1.should.deep.equal(field3);
    field2.should.deep.equal(field3);
  });
  
  it('Field(String) should be not equal Field(Number)', () => {
    field3.should.deep.not.equal(new Field(Number));
  });
  
  it('Verify should pass', (done) => {
    field1 = new Field([String, /^\w{1,5}$/]);
    field1.verify('tom').then(([r]) => {
      r.should.be.true;
      done();
    });
  });
  
  it('Verify should reject', (done) => {
    field1 = new Field([String, /^\w{1,5}$/]);
    field1.verify('tomTom').catch((r) => {
      r.should.be.instanceOf(Error);
      done();
    });
  });
  
});

// let name = Field({
//   type: String,
//   validator: /^[a-z]+$/,
//   errorMessage: 'Invalid name',
//   enum: ['Tom', 'Jerry'],
//   default: 'Tom',
//   required: true
// });
// Object.keys(name).forEach(k => console.log(k + ': ', name[k]));
// console.log(name);
// name.verify(['aaa', 'asd'], (err, r) => {
//   console.log(err, r);
// });

/**
 * same as:
 * {
 *   type: Number,
 *   validator: /^\d{0,3}$/,
 *   enum: [0],
 *   required: false
 * }
 */
// let age = new Field([Int32, /^\d{0,3}$/, [0], false]);
// Object.keys(age).forEach(k => console.log(k + ': ', age[k]));

// age.verify('23').then(console.log).catch(console.log);

// age.verify(1112).then(console.log, console.error);

// let title = new Field(String);

// title.verify('123', console.log);
