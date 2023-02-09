const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: "../web/",
  indexPath: path.resolve("../web/index.aardio"), // 自定义输出首页，其实文件名用默认的 index.html也可以，只不过index.aardio里可以插入aardio代码
  publicPath: "/",
  productionSourceMap: false, // 不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
});
