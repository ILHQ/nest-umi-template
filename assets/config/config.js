import { defineConfig } from 'umi';
import routes from './routes/index';

import env from '../../env';
const alias = require('../alias.config');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: false,
  dva: false,
  locale: {
    antd: 'true',
    default: 'zh-CN',
  },
  mountElementId: 'root-master',
  mfsu: false,
  alias: alias.resolve.alias,
  routes,
  fastRefresh: {},
  publicPath: env.assetsPublicPath,
  lessLoader: {
    javascriptEnabled: true,
  },
  antd: {
    disableBabelPluginImport: true,
  },
});
