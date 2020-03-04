module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8088
  },
  chainWebpack: config => {
    config
      .plugin('copy')
      .tap(args => {
        args[0].push({
          from: 'node_modules/@amcharts/editor4/am4editor',
          to: 'am4editor',
          toType: 'dir'
        });
        return args;
      })
  }
}
