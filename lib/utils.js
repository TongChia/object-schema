const defineKeys = ['type', 'validator', 'validate', 'enum',
  'errorMessage', 'default', 'required', 'name', 'path'];
const validateKeys = ['validator', 'message', 'async', 'error'];

const { isString, isArray, isObject, isPlainObject, keys, find,
        isFunction, isRegExp, isUndefined, isEmpty, difference
      } = require('lodash');

const isValidateObject = (obj) =>
  isObject(obj) && (isFunction(obj.validator) || isRegExp(obj.validator)) &&
  (isUndefined(obj.message) || isString(obj.message)) &&
  isEmpty(difference(keys(obj), validateKeys));

const isValidatesArray = (arr) =>
  isArray(arr) && !isEmpty(arr) && isUndefined(find(arr, v => !isValidateObject(v)));

const isDefineObject = (obj) =>
  isObject(obj) && !isEmpty(obj) &&
  isEmpty(difference(keys(obj), defineKeys));

const isDefinesArray = (arr) =>
  isArray(arr) && !isEmpty(arr) && isUndefined(find(arr, def => (isPlainObject(def) && !isValidateObject(def))));

const isConstructor = (Ctor, dart) => {
  const errMsg = 'is not a constructor';
  let result = false;
  if (typeof Ctor === 'function') {
    try {
      let o = new Ctor();
      if (o instanceof Ctor) {
        result = true;
      }
    } catch (err) {
      if (!err.message.indexOf(errMsg)) {
        result = true;
      }
    }
  }
  if (!result && dart)
    throw new TypeError(`${Ctor.name || String(Ctor)} ${errMsg}`);
  return result;
};

module.exports = {
  isConstructor, isDefineObject, isValidateObject, isValidatesArray, isDefinesArray
};
