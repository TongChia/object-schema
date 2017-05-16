const {reduce, isArray, isUndefined, isPlainObject}   = require('lodash');
const {isConstructor, isDefineObject, isDefinesArray} = require('./utils');
const Field = require('./field');

const createField = (defines, O) => O ?
  (defines instanceof Schema) ? defines :
  (defines instanceof Field) ? defines :
  isConstructor(defines) ? new Field(defines) :
  reduce(defines, (o, define, key) => {
    if (isArray(define) && define.length === 1) {
      o[key] = [createField(define[0])];
    } else if (isConstructor(define) || isDefineObject(define) || isDefinesArray(define))
      o[key] = new Field(define);
    else
      o[key] = createField(define);
    return o;
  }, O) : createField(defines, {});

const Schema = function (defines) {
  
  if (!isPlainObject(defines))
    throw new Error('Not schema defines');
  
  if (!(this instanceof Schema))
    return new Schema(defines);
  
  createField(defines, this);
  
};

Schema.prototype.verify = function (object, cb) {
  
  const getVerifies = (target, schema, verifies) => verifies ?
    (schema instanceof Field) ? verifies.concat(schema.verify(target)) :
    reduce(schema, (vs, field, key) => !isUndefined(target[key]) ?
      getVerifies(target[key], field, vs) :
      vs
    , verifies) : getVerifies(target, schema, []);
    
  let vs = getVerifies(object, this);
  let q = Promise.all(vs);
  
  return cb ? q.then(r => cb(null, r)) : q;
  
};

module.exports = Schema;
