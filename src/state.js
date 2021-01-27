import { observer } from './observer/index'


export function initState(vm) {
    const opts = vm.$options
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        intiComuted(vm)
    }
    if (opts.watch) {
        initWach(vm)
    }
}
function initProps(vm) { }
function initMethods(vm) { }
function initData(vm) {
    // 数据初始化
    let data = vm.$options.data()//用户传递的
    data = vm._data = typeof data === 'function' ? data.call(vm) : data
    //对象劫持
    observer(data)
}
function intiComuted(vm) { }
function initWach(vm) { }
