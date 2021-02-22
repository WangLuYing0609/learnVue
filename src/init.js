import { initState } from './state'
import { compileToFunction } from './compiler/index'
// 原型上添加init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this //vue中使用this.$options 指代用户的传递属性
        vm.$options = options
        // 初始化状态
        initState(vm)    //vm.$options.data   数据劫持
        if (vm.$options.el) {
            //数据挂载模版     自动挂载
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options
        el = document.querySelector(el);
        // 把模版转换成对应的渲染函数 =》 虚拟dom概念  vnode =》 diff算法 更新虚拟dom =》产生新节点 更新
        // render是内置渲染vnode的方法
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML
                let render = compileToFunction(template)
                console.log(render,'render');
                options.render = render
            }
        }
    }
}