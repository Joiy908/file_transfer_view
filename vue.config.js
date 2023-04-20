const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
    proxy: {
      '/path': {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        logLevel: "debug"
      },
      '/delete': {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        logLevel: "debug"
      },
      '/messages': {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        logLevel: "debug"
      },
      '/upload': {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  },
  assetsDir: 'static'
})
