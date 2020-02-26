const path = require('path');
 //const serverUrl = 'http://127.0.0.1:8090'; // 本地
 const serverUrl = 'http://www.fractalmind.com.cn'; // 线上

// 18368166@qq.com   123456
// 27078025@qq.com   123456

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    // babel-plugin-module-resolver 插件配置
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "test": "./test",
      }
    }]
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    'components': path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: false,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: false,
  proxy: {
    '/admin': serverUrl,
    '/web': serverUrl,
    '/upload': serverUrl,
    '/static': serverUrl
  }
};
