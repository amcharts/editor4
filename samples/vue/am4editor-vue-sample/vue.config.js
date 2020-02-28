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
          from: 'node_modules/@amcharts/am4editor/am4editor',
          to: 'am4editor',
          toType: 'dir'
        });
        return args;
      })
  }
}
