module.exports = {
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true
  },
  configureWebpack:{
    node: {
      process: false,
    }
  }
}
