(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  // 把data中的数据 使用Object.defineProperty重新定义
  function observer(data) {
    console.log(isObject(), data, 'observe');
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) ;

    if (opts.watch) ;
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data(); //用户传递的

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; //对象劫持

    observer(data);
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据劫持
      var vm = this; //vue中使用this.$options 指代用户的传递属性

      vm.$options = options; // 初始化状态

      initState(vm);
    };
  }

  function Vue(opation) {
    // 进行Vue的初始化操作
    this._init(opation);
  } // 通过引入文件的方法给原型上添加一个_init方法


  initMixin(Vue); //给Vue上添加一个_init方法

  return Vue;

})));
//# sourceMappingURL=vue.js.map
