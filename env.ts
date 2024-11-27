import { merge } from 'lodash';

import * as pkg from './package.json';

const routerPrefix = `/app/${pkg.name}`;
const commonConfig = JSON.parse(process.env.common_config || '{}');
const customConfig = JSON.parse(process.env.config || '{}');

export default merge(
  {
    env: process.env.NODE_ENV,
    routerPrefix,
    proxyPrefix: `${routerPrefix}/proxy`,
    assetsPublicPath: `${routerPrefix}/assets/dist/`,
    'spacial-modeling': 'http://195.195.32.133:8000/spacial-modeling',
  },
  commonConfig,
  customConfig,
);
