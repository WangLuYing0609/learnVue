import { observer } from './observer/index'
import { isFunction } from './utils/index'


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
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}
function initData(vm) {
    // 数据初始化
    let data = vm.$options.data()//用户传递的   vue内部会对属性检测，如果是以$开头 不会进行
    data = vm._data = isFunction(data) ? data.call(vm) : data

    for (let key in data) {
        proxy(vm, '_data', key)
    }


    //对象劫持
    observer(data)
}
function intiComuted(vm) { }
function initWach(vm) { }
