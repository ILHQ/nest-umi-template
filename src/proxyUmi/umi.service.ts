import { Injectable } from '@nestjs/common';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import envConfig from '../../env';

@Injectable()
export class UmiService {
  getHealth(): string {
    return 'hello!';
  }

  proxyDevServer(): RequestHandler {
    return createProxyMiddleware({
      target: 'ws://localhost:8000',
      ws: true,
      changeOrigin: true,
    });
  }

  proxyAssets(): RequestHandler {
    return createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
    });
  }

  proxySpacialModeling(): RequestHandler {
    return createProxyMiddleware({
      target: envConfig['spacial-modeling'],
      changeOrigin: true,
      pathRewrite: { [`^${envConfig.proxyPrefix}/spacial-modeling`]: '' },
      on: {
        proxyRes: (proxyRes, req, res) => {
          res.removeHeader('Content-Length');
          res.setHeader('Transfer-Encoding', 'chunked');
        },
      },
    });
  }
}
