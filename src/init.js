import { initState } from './state'
// 原型上添加init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function (options) {
        // 数据劫持
        const vm = this //vue中使用this.$options 指代用户的传递属性
        vm.$options = options
        // 初始化状态
        initState(vm)
    }
}