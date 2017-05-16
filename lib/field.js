const { isString, isArray, isObject, isBoolean, map, find,
        concat, isUndefined, isFunction, isRegExp, isEqual
      }   = require('lodash');
const { isConstructor, isDefinesArray, isDefineObject,
        isValidateObject, isValidatesArray
      }   = require('./utils');
const Any = require('./types/any');

/**
 * Create a field of schema.
 * @param {Object|Array|Function} defines
 * @param defines.type Field type (constructor).
 * @param {RegExp|Function} [defines.validator]
 * @param {String} [defines.errorMessage]
 * @param {Array} [defines.enum]
 * @param [defines.default]
 * @param {Boolean} [defines.required]
 * @returns {Field}
 * @constructor
 */
const Field = function (defines) {
  
  if (isFunction(defines) && isConstructor(defines)) {
    return new Field({type: defines});
  } else if (isArray(defines) && isDefinesArray(defines))
    return defineFieldWithArray(defines);
  else if (!(isObject(defines) && isDefineObject(defines)))
    throw new Error('Not field defines');
  
  if (!(this instanceof Field))
    return new Field(defines);
  
  const proxy = {}, configurable = false;
  
  // this.type = defines.type || Any;
  Object.defineProperties(this, {
    'type'    : {
      configurable,
      writable    : false,
      enumerable  : true,
      value       : defines.type || Any
    },
    'validate': {
      configurable,
      get: () => proxy['validate'],
      set: (v) => {
        if (isValidatesArray(v)) proxy.validate = v;
        else throw new TypeError('Irregular validation object');
      }
    },
    'enum'    : {
      configurable,
      get: () => proxy['enum'],
      set: (v) => {
        if (this.validate) {
          //TODO: check values;
        }
        proxy.enum = v;
      }
    },
    'default' : {
      configurable,
      get: () => proxy['default'],
      set: (v) => {
        if (this.validate) {
          //TODO', check values;
        }
        proxy.default = v;
      }
    },
    'required': {
      configurable,
      get: () => proxy['required'],
      set: (v) => {
        if (isBoolean(v)) proxy.required = v;
        else throw new TypeError('Field.required should be [Boolean]');
      }
    },
    'errorMessage': {
      configurable,
      get: () => proxy['errorMessage'],
      set: (v) => {
        if (isString(v)) proxy.errorMessage = v;
        else throw new TypeError('Field.errorMessage should be [String]');
      }
    }
  });
  
  this.required = defines.required || false;
  
  if (defines.validate)
    this.validate = defines.validate;
  
  if (defines.validator) {
    if (this.validate)
      this.validate.concat({validator: defines.validator});
    else
      this.validate = [{validator: defines.validator}];
  }
  
  if (defines.enum)
    this.enum = defines.enum;
  
  if (defines.default)
    this.default = defines.default;
  
  if (defines.errorMessage)
    this.errorMessage = defines.errorMessage;
  
};

/**
 * Create [Field] with array parameter.
 * Can not define attributes ['default', ''].
 * @param {Array} defines
 * @returns {Field}
 */
const defineFieldWithArray = (defines) => {
  let param = {};
  // , first = defines[0];
  
  // if (defines.length === 1 && isPlainObject(first))
  //   return [new Field(first)];
  // else if (isConstructor(first))
  if (isConstructor(defines[0]))
    param.type = defines.shift();
  else
    param.type = Any;
  
  defines.forEach(define => {
    if (isFunction(define) || isRegExp(define)) {
      param.validate = param.validate ? param.validate.concat({validator: define}) : [{validator: define}];
    } else if (isBoolean(define)) {
      param.required = define;
    } else if (isValidateObject(define)) {
      param.validate = param.validate ? param.validate.concat(define) : [define];
    } else if (isValidatesArray(define)) {
      param.validate = param.validate ? param.validate.concat(define) : define;
    } else if (isArray(define)) {
      param.enum = param.enum ? param.enum.concat(define) : define;
    } else {
      param.enum = param.enum ? param.enum.concat(define) : [define];
    }
  });
  
  return new Field(param);
};

// Field.prototype.addValidate = function addValidate (v) {
//   this.validate = this.validate || [];
//   if (has(v, 'validator')) {
//     this.addValidate = this.addValidate || [];
//     this.addValidate.push({validator: v.validator, message: v.message});
//   } else if (isFunction(v) || isRegExp(v)) {
//     this.addValidate({
//       validator: v
//     });
//   }
//
//   return this;
// };
Field.prototype.toJSON = function () {
  return {type: this.type};
};

Field.prototype.isAllowed =
Field.prototype.isInEnum = function (value, cb) {
  let result = this.enum ?
    !isUndefined(find(this.enum, e => isEqual(
      e instanceof this.type ? e : new this.type(e),
      value instanceof this.type ? value : new this.type(value)
    ))) : true;
  
  return cb ? cb(result) : result;
};

Field.prototype.verify = function (value, cb) {
  let verifies = [], error;
  
  // if (!(value instanceof this.type)) {
  //   try {
  //     let example = new this.type(value);
  //     if (!(example instanceof this.type))
  //       error = new Error(`${value} can not create ${this.type}`);
  //   } catch (err) {
  //     error = new TypeError(`${value} not a usable ${this.type} value`);
  //   }
  //   if (error)
  //     return cb ? cb(error) : Promise.reject(error);
  // }
  
  if (!this.isAllowed(value)) {
    error = new Error(`Illegal value ${value}`);
    return cb ? cb(error) : Promise.reject(error);
  }
  
  if (this.validate) {
  
    //TODO: 优化执行顺序, 放入单层数组
    verifies = map(this.validate, ({validator, message, async}) => {
      error = new Error(message || this.errorMessage || 'Verification failed.');
      if (isRegExp(validator)) {
        return validator.test(value) ? true : Promise.reject(error);
      }
      if (async) {
        return new Promise((resolve, reject) =>
          validator(value, (err, r) => {
            if (err) reject(err instanceof Error ? err : error);
            else resolve(r);
          })
        );
      }
      
      return (r => !r ? Promise.reject(error) : r)(validator(value));
    });
    
    let p = Promise.all(verifies);
    // .then(results => isUndefined(find(results, r => (r !== true))) ? Promise.resolve(true) : Promise.reject());
    
    return cb ? p.then(r => cb(null, r)).catch(cb) : p;
  }
  
  return cb ? cb(true) : Promise.resolve(true);
};

module.exports = Field;
module.exports.Field = Field;
