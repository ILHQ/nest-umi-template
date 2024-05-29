const fs = require('fs-extra');
const archiver = require('archiver');
const { exec } = require('shelljs');
const path = require('path');
const zerg = process.argv.indexOf('zerg') > -1;
const pkg = require('./package.json');
try {
  if (zerg) {
    fs.outputFileSync(
      path.resolve('bin', 'start.sh'),
      'cd /home/admin/source/${APP_NAME}/out && npm start',
    );
  } else {
    fs.outputFileSync(path.resolve('bin', 'start.sh'), 'npm start');
  }

  exec(
    'cd ./assets ; npm run build ; cd .. ; rm -rf out ; rsync -av --exclude=assets/ --exclude=*.zip --exclude=/dist/ ./ out/ ; rsync -av assets/dist out/assets',
  );
  const zipName = `${pkg.name}_${pkg.version}`;
  exec('mkdir bin');

  if (zerg) {
    exec(`zip -ry -p ${zipName}.zip ./out ./bin`);
    exec('rm -rf out');
  } else {
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
      exec(
        `docker build -t ${pkg.name}:${pkg.version} . --platform linux/amd64`,
      );
    });

    // 监听错误事件
    archive.on('error', (err) => {
      throw err;
    });
    archive.directory('out', zipName); // 添加整个文件夹
    archive.pipe(output);
    // 开始压缩
    archive.finalize();
  }
} catch (err) {
  console.error(err);
}
