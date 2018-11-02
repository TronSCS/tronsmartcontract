module.exports = {
  devServer: {
    disableHostCheck: true
  },
  configureWebpack:{
    node: {
      process: false,
    }
  }
}
