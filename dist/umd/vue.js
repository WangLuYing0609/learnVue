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

  function isFunction(data) {
    return typeof data === 'function';
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
  var arryMethods = Object.create(oldArryMethods); // arryMethods.__proto__ = Arry.prototype  继承

  var methods = ['push', 'shift', 'unshift', 'shift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (item) {
    arryMethods[item] = function () {
      console.log('调用push'); // 切片编程

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArryMethods[item].apply(this, args); //调用原生方法
      // push unshift splice添加的元素可能还是一个对象

      var inserted; //用户插入的数据

      var ob = this.__ob__; //根据当前实例获取observer方法

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

    if (data.__ob__) {
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

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newVal) {
        vm[source][key] = newVal;
      }
    });
  }

  function initData(vm) {
    // 数据初始化
    var data = vm.$options.data(); //用户传递的   vue内部会对属性检测，如果是以$开头 不会进行

    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    } //对象劫持


    observer(data);
  }

  var cname = '[a-zA-Z_][\\w\\-\\.]*'; //标签名   

  var qnameCapture = "((?:".concat(cname, "\\:)?").concat(cname, ")"); //获取标签名

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); //匹配开始标签
  // aa = "xxxx" | 'xxxx' | xxxx

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/; //标签关闭 > />
  //  Html字符串解析成对应的脚本 

  function parserHTML(html) {
    function advance(len) {
      html = html.substring(len);
    }

    function start(tagName, attr) {}

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var end, attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push([{
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          }]);
          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }

      return false; //不是开始标签
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
      }
    }
  }

  function compileToFunction(template) {
    console.log(template, 'www');
    parserHTML(template);
  }

  function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
      // 数据劫持
      var vm = this; //vue中使用this.$options 指代用户的传递属性

      vm.$options = options; // 初始化状态

      initState(vm); //vm.$options.data   数据劫持

      if (vm.$options.el) {
        //数据挂载模版     自动挂载
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el); // 把模版转换成对应的渲染函数 =》 虚拟dom概念  vnode =》 diff算法 更新虚拟dom =》产生新节点 更新
      // render是内置渲染vnode的方法

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
          var render = compileToFunction(template);
          console.log(render, 'render');
          options.render = render;
        }
      }
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
