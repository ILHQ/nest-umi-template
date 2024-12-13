import {
  Controller,
  Get,
  UseFilters,
  Redirect,
  Render,
  All,
  Req,
  Res,
} from '@nestjs/common';
import { UmiService } from './umi.service';
import { Request, Response } from 'express';
import { AllExceptionsFilter } from '../http-exception.filter';
import envConfig from '../../env';
import { readFileSync } from 'fs';
import * as process from 'process';
const fs = require('fs-extra');
import * as path from 'path';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

@Controller()
@UseFilters(AllExceptionsFilter)
export class UmiController {
  constructor(private readonly umiService: UmiService) {}

  @Get()
  @Redirect(envConfig.routerPrefix, 302)
  getPath(): void {}

  @Get(`/health`)
  getHealth(): string {
    return this.umiService.getHealth();
  }

  @Get(`/dev-server/*`)
  proxyDevServer(@Req() req: Request, @Res() res: Response): void {
    if (process.env.NODE_ENV !== 'production') {
      const proxy = this.umiService.proxyDevServer();
      proxy(req, res, (result) => {
        if (result instanceof Error) {
          throw result;
        }
      });
    }
  }

  @Get(`${envConfig.routerPrefix}/assets/dist/*`)
  proxyAssets(@Req() req: Request, @Res() res: Response): void {
    if (process.env.NODE_ENV !== 'production') {
      const proxy = this.umiService.proxyAssets();
      proxy(req, res, (result) => {
        if (result instanceof Error) {
          throw result;
        }
      });
    }
  }

  // 代理
  @All(`${envConfig.proxyPrefix}/spacial-modeling/*`)
  proxySpacialModeling(@Req() req: Request, @Res() res: Response): void {
    const proxy = this.umiService.proxySpacialModeling();
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        throw result;
      }
    });
  }

  @Get(envConfig.routerPrefix + '*')
  @Render('index')
  getIndex(): object {
    let cssHash = '';
    let jsHash = '';
    if (process.env.NODE_ENV) {
      const targetDir = path.join(process.cwd(), './assets/dist');
      const files = fs.readdirSync(targetDir);
      const cssFiles = files.filter((file) => file.endsWith('.css'));
      const jsFiles = files.filter((file) => file.endsWith('.js'));
      cssFiles.forEach((fileName) => {
        const match = fileName.match(/.*\.([a-f0-9]+)\.css$/);
        if (match) {
          cssHash = '.' + match[1]; // 提取的哈希值
        } else {
          console.log('No hash found in:', fileName);
        }
      });
      jsFiles.forEach((fileName) => {
        const match = fileName.match(/.*\.([a-f0-9]+)\.js$/);
        if (match) {
          jsHash = '.' + match[1]; // 提取的哈希值
        } else {
          console.log('No hash found in:', fileName);
        }
      });
    }
    return {
      cssHash,
      jsHash,
      title: pkg.description,
      routerPrefix: envConfig.routerPrefix,
      env: envConfig.env,
      publicPath: envConfig.assetsPublicPath,
      imgDomain: envConfig.imgDomain,
      cndDomain: envConfig.cndDomain,
      proxyPrefix: envConfig.proxyPrefix,
    };
  }
}
