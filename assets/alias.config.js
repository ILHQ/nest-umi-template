/**
 * webstorm的webpack映射文件
 * */
const resolve = (dir) => require('path').join(__dirname, dir);

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@public': resolve('public'),
    },
  },
};
