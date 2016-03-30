/*****************************************
 * AUTHOR : nanyuantingfeng
 * DATE : 3/30/16
 * TIME : 21:11
 ****************************************/

var Class = require('nclass').Class;

var Mocker = Class(Object, function () {
  this.store = new Map();
  this.flag = new Map();
});

Mocker.fn.store = undefined;

Mocker.fn.flag = undefined;

Mocker.fn.get = function (path) {
  return this.store.get(path);
};

Mocker.fn.set = function (path, obj) {
  this.store.set(path, obj);
  this.flag.set(path, true);
  return this;
};

Mocker.fn.disable = function (path) {
  this.flag.set(path, false);
  return this;
};

Mocker.fn.isValid = function (path) {
  return this.store.has(path) && this.flag.has(path)
};

Mocker.fn.mock = function (path, f) {
  this.set(path, f.call());
  return this;
};


module.exports = Mocker.Mocker = Mocker;