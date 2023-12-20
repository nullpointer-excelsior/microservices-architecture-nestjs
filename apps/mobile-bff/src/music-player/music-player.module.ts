import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PlayerProxyMiddleware } from './middlewares/player-proxy.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot()
    ],
    providers: [
        PlayerProxyMiddleware
    ],
})
export class MusciPlayerModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(PlayerProxyMiddleware)
            .forRoutes('/player/songs');
    }

}
