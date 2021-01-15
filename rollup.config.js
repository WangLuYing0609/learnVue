// rollup的配置文件
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',//入口文件
    output: {
        file: 'dist/umd/vue.js',//出口路径
        name: 'Vue',//打包后的全局变量的名字
        format: 'umd',//同意打包规范
        sourcemap: true,//es6->es5  开启源码调试  能够找到源码报错的位置
    },
    plugins: [//使用插件
        babel({
            exclude: 'node_modules/**'
        }),
        process.env.ENV === 'development' ? serve({
            open: true,
            openPage: '/public/index.html',//默认打开的html路径
            port: 3000,
            contentBase: ''
        }) : null
    ]
}

