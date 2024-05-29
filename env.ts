import { merge } from 'lodash';

import * as pkg from './package.json';

// zerg部署需要
const APP_CLUSTER = process.env.APP_CLUSTER
  ? `${process.env.APP_CLUSTER}/${pkg.name}`
  : '';

const routerPrefix = `${APP_CLUSTER}/app/${pkg.name}`;
const commonConfig = JSON.parse(process.env.common_config || '{}');
const customConfig = JSON.parse(process.env.config || '{}');
const appPrefix = `app/${pkg.name}`;

export default merge(
  {
    env: process.env.NODE_ENV,
    routerPrefix,
    appPrefix,
    proxyPrefix: `${routerPrefix}/proxy`,
    assetsPublicPath: `${routerPrefix}/assets/dist/`,
    'spacial-modeling': 'http://195.195.32.133:8000/spacial-modeling',
    'set-center': 'http://195.195.32.133:8000/set-center',
  },
  commonConfig,
  customConfig,
);
