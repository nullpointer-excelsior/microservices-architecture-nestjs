import "reflect-metadata";
import { CreateSdkOptions, startOpenTelemetry } from "@lib/shared/instrumentation";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { CorsOptions, CorsOptionsDelegate } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getMicroserviceOptions } from "../../../integration-events/src";

export type RestfulApiOptions = {
    title: string;
    description: string;
    version: string;
    cors?: CorsOptions | CorsOptionsDelegate<any>;
}

export class NestjsApplicationBuilder {

    private IsMicroservicesEnabled = false;

    constructor(private app: INestApplication) { }

    enableRestfulApi(options: RestfulApiOptions) {
        const { title, description, version, cors } = options;
        this.app.enableCors(cors)
        this.app.useGlobalPipes(new ValidationPipe());
        const config = new DocumentBuilder()
            .setTitle(title)
            .setDescription(description)
            .setVersion(version)
            .build();
        const document = SwaggerModule.createDocument(this.app, config);
        SwaggerModule.setup('api', this.app, document);
        return this;
    }

    enableTelemetry(options: CreateSdkOptions) {
        startOpenTelemetry(options)
        return this;
    }

    enableMicroservice(options: any) {
        this.IsMicroservicesEnabled = true;
        this.app.connectMicroservice(options);
        return this;
    }

    build() {
        if (this.IsMicroservicesEnabled) {
            this.app.startAllMicroservices();
        }
        return this.app;
    }

    static async builder(module: any) {
        const app = await NestFactory.create(module)
        return new NestjsApplicationBuilder(app)
    }

    static start(app: INestApplication, name: string) {
        const appPort = name.toUpperCase().replace(/-/g, '_');
        const port = process.env[`${appPort}_APP_PORT`] || 3000;
        app.listen(port, () => {
            Logger.log(`${name} microservice listen on port: ${port}`, "Main")
        });
    }

}

NestjsApplicationBuilder.builder(null).then(app => {
    return app
        .enableRestfulApi({
            title: 'Merch Payments API',
            description: 'Payment microservice for artist merchs',
            version: '1.0',
        })
        .enableMicroservice(getMicroserviceOptions())
        .enableTelemetry({
            serviceName: "music-discovery-ms",
            serviceVersion: "1.0",
            instrumentations: []
        })
        .build();
})