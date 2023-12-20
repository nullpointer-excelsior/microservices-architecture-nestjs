import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as proxy from 'http-proxy-middleware';

@Injectable()
export class PlayerProxyMiddleware implements NestMiddleware {

  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const target = this.config.get<string>('MOBILE_BFF_PLAYER_API');
    const proxyMiddleware = proxy.createProxyMiddleware({
      target: target, 
      changeOrigin: true,
    });
    proxyMiddleware(req, res, next);
  }

}