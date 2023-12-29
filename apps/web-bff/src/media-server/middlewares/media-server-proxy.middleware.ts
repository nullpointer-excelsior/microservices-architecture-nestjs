import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as proxy from 'http-proxy-middleware';

@Injectable()
export class MediaServerProxyMiddleware implements NestMiddleware {

  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const target = this.config.get<string>('MOBILE_BFF_PLAYER_API');
    
    const proxyMiddleware = proxy.createProxyMiddleware({
      target: target, 
      changeOrigin: true,
      logLevel: 'silent'
    });
    Logger.log(`Redirect -> ${target}${req.baseUrl}`, 'MediaServerProxyMiddleware');
    proxyMiddleware(req, res, next);
  }

}