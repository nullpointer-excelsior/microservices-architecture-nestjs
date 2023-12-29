import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MediaServerProxyMiddleware } from './middlewares/media-server-proxy.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    providers: [
        MediaServerProxyMiddleware
    ],
})
export class MediaServerModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(MediaServerProxyMiddleware)
            .forRoutes('audio/*', 'cover/*');
    }

}
