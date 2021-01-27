import { initMixin } from './init'



function Vue(opation) {
    // 进行Vue的初始化操作
    this._init(opation)
}
// 通过引入文件的方法给原型上添加一个_init方法
initMixin(Vue)   //给Vue上添加一个_init方法
export default Vue