const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  // 男女に応じて書き換える
  publicPath: process.env.NODE_ENV === 'production' ? '/Selection_System_hcs202505' : '/',
  pages: {
    index: {
      entry: "src/main.js",
      title: "実験"
    }
  }
})
