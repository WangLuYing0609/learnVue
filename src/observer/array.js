//  重写数组的方法   push shift unshift pop reverse sort splice   会导致数组本身发生变化
let oldArryMethods = Array.prototype;
export let arryMethods = Object.create(oldArryMethods)
// arryMethods.__proto__ = Arry.prototype  继承

const methods = [
    'push', 'shift', 'unshift', 'shift', 'pop', 'reverse', 'sort', 'splice'
]

methods.forEach((item) => {
    arryMethods[item] = function (...args) {
        console.log('调用push');
        // 切片编程
        const result = oldArryMethods[item].apply(this, args) //调用原生方法
        // push unshift splice添加的元素可能还是一个对象
        let inserted;//用户插入的数据
        let ob = this.__ob__;//根据当前实例获取observer方法
        switch (item) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2)
                break;
            default:
                break;
        }
        if (inserted) ob.observerArry(inserted) // 将新增属性继续监听

        return result
    }
})