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

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

@Controller()
@UseFilters(AllExceptionsFilter)
export class UmiController {
  constructor(private readonly umiService: UmiService) {}

  @Get()
  @Redirect(envConfig.appPrefix, 302)
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

  @Get(`${envConfig.appPrefix}/assets/dist/*`)
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

  @All(`${envConfig.proxyPrefix}/spacial-modeling/*`)
  proxySpacialModeling(@Req() req: Request, @Res() res: Response): void {
    const proxy = this.umiService.proxySpacialModeling();
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        throw result;
      }
    });
  }

  @All(`${envConfig.proxyPrefix}/set-center/*`)
  proxySetCenter(@Req() req: Request, @Res() res: Response): void {
    const proxy = this.umiService.proxySetCenter();
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        throw result;
      }
    });
  }

  @Get(envConfig.appPrefix + '/*')
  @Render('index')
  getIndex(): object {
    return {
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
