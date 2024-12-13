const fs = require('fs-extra');
const archiver = require('archiver');
const { exec } = require('shelljs');
const shell = require('shelljs');
const path = require('path');
const pkg = require('./package.json');
try {
  exec('mkdir bin');
  fs.outputFileSync(path.resolve('bin', 'start.sh'), 'npm run start:prod');

  // 启用错误处理，如果某个命令失败，脚本会退出
  shell.set('-e');

  // 1. 构建项目
  if (shell.cd('./assets').code !== 0) {
    console.error('未找到assets目录');
    process.exit(1);
  }

  if (shell.exec('npm run build').code !== 0) {
    console.error('构建出错');
    process.exit(1);
  }

  shell.cd('..');

  // 2. 清理输出目录
  if (shell.test('-d', 'out')) {
    if (shell.rm('-rf', 'out').code !== 0) {
      console.error('清理out目录出错');
      process.exit(1);
    }
  }

  // 3. 同步文件到输出目录
  if (
    shell.exec(
      'rsync -av --exclude=assets/ --exclude=*.zip --exclude=/dist/ ./ out/',
    ).code !== 0
  ) {
    console.error('同步nest文件出错');
    process.exit(1);
  }

  // 4. 同步构建后的静态资源
  if (shell.exec('rsync -av assets/dist out/assets').code !== 0) {
    console.error('同步assets文件出错');
    process.exit(1);
  }

  const zipName = `${pkg.name}_${pkg.version}`;

  const output = fs.createWriteStream(`${zipName}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  output.on('close', () => {
    exec('rm -rf out');
    console.log(`文件打包成功，共 ${archive.pointer()} 字节。`);
    // 生成Dockerfile
    const dockerfile = `
  FROM node:16-slim

  LABEL author="zlfront"

  ENV ARRANGE_PATH=/home/admin/source

  WORKDIR $ARRANGE_PATH

  COPY ./${zipName}.zip ./
  RUN apt-get update && apt-get install unzip
  RUN unzip ./${zipName}.zip
  RUN rm ./${zipName}.zip
  RUN npm config set registry https://registry.npmmirror.com && npm install pm2@latest -g
  WORKDIR $ARRANGE_PATH/${zipName}/bin

  EXPOSE 3000

  CMD ["pm2-runtime", "start", "start.sh", "--name", "${zipName}"]
      `;
    fs.writeFileSync(path.resolve('Dockerfile'), dockerfile);
  });

  // 监听错误事件
  archive.on('error', (err) => {
    throw err;
  });
  archive.directory('out', zipName); // 添加整个文件夹
  archive.pipe(output);
  // 开始压缩
  archive.finalize();
} catch (err) {
  console.error(err);
}
