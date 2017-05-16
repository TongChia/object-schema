const Any = function(value) {
  if(!(this instanceof Any)) return new Any(value);
  
  this.value = value;
};

Any.prototype.valueOf = function() {
  return this.value;
};

Any.prototype.toJSON = function() {
  return this.value;
};

module.exports = Any;
module.exports.Any = Any;
