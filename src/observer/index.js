// 把data中的数据 使用Object.defineProperty重新定义
// Object.defineProperty不能兼容ie8及以下   vue2无法兼容ie8
// vue3使用poxy
import { isObject } from '../utils/index'
export function observer(data) {
    console.log(isObject(), data, 'observe');
}