// node dev.js 要打包的名字 -f 打包的格式
// node scripts/dev.js reactivity -f esm
const esbuild = require('esbuild')

const minimist = require("minimist"); // 解析命令行参数
const path = require('path')

// node 中的命令行参数通过 process.argv
const args = minimist(process.argv.slice(2)); // { _: [ 'reactivity' ], f: 'esm' }
const target = args._[0] || 'reactivity' // 打包哪个项目
const format = args.f || 'iife' // 打包后的模块化规范

const dirname = path.resolve(__dirname)
const pkg = require(path.resolve(dirname,`../packages/${target}/package.json`))
// 打包入口
const entry = path.resolve(dirname,`../packages/${target}`)
// 开发环境直接用 esbuild 打包了
esbuild.context({
    entryPoints:[entry], // 入口
    outfile:path.resolve(dirname,`../packages/${target}/dist/${target}.js`),
    bundle:true, // reactive 依赖 share 会打包在一起
    platform:"browser",
    sourcemap:true, // 可以调试源代码
    format, // cjs esm iife
    globalName:pkg.buildOptions?.name // iife 必须要一个变量,用了 package.json 中的 buildOptions.name
}).then((ctx) => {
    console.log('start dev')
    return ctx.watch() // 监控文件实时打包
}).catch((err) => {
    console.log(err)
})
