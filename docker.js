const { exec } = require('shelljs');
const path = require('path');

const pkg = require(path.resolve('package.json'));
exec(`docker build -t ${pkg.name}:${pkg.version} . --platform linux/amd64`);
exec(
  `docker save -o ${pkg.name}_${pkg.version}.tar ${pkg.name}:${pkg.version}`,
);
