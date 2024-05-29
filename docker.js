const { exec } = require('shelljs');
const path = require('path');

const pkg = require(path.resolve('package.json'));
exec(
  `docker tag ${pkg.name}:${pkg.version} registry.cn-hangzhou.aliyuncs.com/zilu_front/${pkg.name}:${pkg.version}`,
);
exec(
  `docker push registry.cn-hangzhou.aliyuncs.com/zilu_front/${pkg.name}:${pkg.version}`,
);
