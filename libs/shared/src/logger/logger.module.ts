import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req: any) => {
          return req.headers['x-header-id'];
        },
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        // install 'pino-pretty' package in order to use the following option
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        redact: {
          paths: [
            'httpRequest.data.bestImageTemplateRaw',
            'httpRequest.data.frontsideImage',
            'httpRequest.data.backsideImage',
            'httpRequest.data.tokenFaceImage',
            'httpRequest.data.templateRaw',
          ],
          censor: '###########',
        },
      },
    }),
  ],
})
export class LoggerModule {}
