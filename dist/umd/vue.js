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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }
  function def(data, key, val) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: val
    });
  }

  //  重写数组的方法   push shift unshift pop reverse sort splice   会导致数组本身发生变化
  var oldArryMethods = Array.prototype;
  var arryMethods = Object.create(oldArryMethods);
  var methods = ['push', 'shift', 'unshift', 'shift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (item) {
    arryMethods[item] = function () {
      console.log('调用push'); // 切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArryMethods[item].apply(this, args); //调用原生方法
      // push unshift 添加的元素可能还是一个对象

      var inserted; //用户插入的数据

      var ob = this.__ob__;

      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observerArry(inserted); // 将新增属性继续监听

      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(val) {
      _classCallCheck(this, Observer);

      // 给每一个监控过的对象增加__ob__属性
      def(val, '__ob__', this); // val如果数据的层次多，就需要递归

      if (Array.isArray(val)) {
        // 数据劫持  数组每一项劫持  重写数组的方法
        val.__proto__ = arryMethods;
        this.observerArry(val);
      } else {
        this.walk(val);
      }
    }

    _createClass(Observer, [{
      key: "observerArry",
      value: function observerArry(data) {
        for (var i = 0; i < data.length; i++) {
          observer(data[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal !== value) {
          value = newVal;
          observer(value);
        }
      }
    });
  }

  function observer(data) {
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
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
