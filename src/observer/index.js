// 把data中的数据 使用Object.defineProperty重新定义
// Object.defineProperty不能兼容ie8及以下   vue2无法兼容ie8
// vue3使用proxy
import { isObject, def } from '../utils/index'
import { arryMethods } from './array'
class Observer {
    constructor(val) {
        // 给每一个监控过的对象增加__ob__属性
        def(val, '__ob__', this)
        // val如果数据的层次多，就需要递归
        if (Array.isArray(val)) {
            // 数据劫持  数组每一项劫持  重写数组的方法
            val.__proto__ = arryMethods
            this.observerArry(val)
        } else {
            this.walk(val)
        }

    }
    observerArry(data) {
        for (let i = 0; i < data.length; i++) {
            observer(data[i])
        }
    }
    walk(data) {
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}
function defineReactive(data, key, value) {
    observer(value)
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newVal) {

            if (newVal !== value) {
                value = newVal
                observer(value)
            }
        }
    })
}
export function observer(data) {
    if (!isObject(data)) {
        return
    }
    if (data.__ob__) {
        return
    }
    return new Observer(data)
}