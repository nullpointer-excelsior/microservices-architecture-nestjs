# Microservicios: Observabilidad en microservicios, un ejemplo práctico de trazas distribuidas

## Introducción

En el mundo de los microservicios, la observabilidad es un aspecto crucial para entender el comportamiento y el rendimiento de nuestras aplicaciones. La observabilidad nos permite recopilar y analizar datos de diferentes fuentes para obtener una visión completa de nuestras aplicaciones. Este enfoque holístico no solo nos proporciona una visión exhaustiva de cada componente de nuestras aplicaciones, sino que también nos permite identificar patrones, anomalías y optimizaciones potenciales, contribuyendo así a fortalecer la robustez y eficiencia de nuestras soluciones tecnológicas.

En este artículo abordaremos cómo implementar trazas distribuidas sobre el flujo de 2 aplicaciones en un entorno de microservicios utilizando OpenTelemetry y JagerUI sobre un sistema de microservicios que emula la plataforma de Spotify. Todo con NestJs 😉.

## Las bases de la observabilidad

Cuando nos adentramos en el mundo de la observabilidad, escucharemos muy a menudo el concepto de MELT, el cual es un acrónimo que se refiere a los cuatro pilares de la observabilidad: Métricas, Eventos, Logs y Trazas.

- **Métricas**: son datos numéricos que representan el estado de nuestra aplicación en un momento dado.
- **Eventos**: son registros de acciones o cambios significativos en nuestra aplicación.
- **Logs**: son registros detallados de las actividades de nuestra aplicación.
- **Trazas**: son representaciones visuales de cómo las solicitudes fluyen a través de nuestra aplicación.

Visualmente nos puede quedar más claro con la siguiente imagen:

![meltex](https://i.ibb.co/FXYNHVf/melt.png)

## La importancia de las trazas en sistemas distribuidos

Las trazas en una aplicación distribuida son fundamentales porque ofrecen una ventana detallada hacia el flujo de datos y acciones entre sus distintos componentes. Estas trazas permiten seguir el camino de una solicitud o proceso a través de los diversos servicios, facilitando la detección de problemas, la depuración de errores, la optimización del rendimiento y la comprensión holística de la interacción entre los elementos distribuidos.

## ¿Qué es OpenTelemetry?

[OpenTelemetry](https://opentelemetry.io/docs/) es un conjunto de APIs, bibliotecas y agentes que permiten la recopilación y gestión de telemetría (métricas, logs, trazas) de nuestras aplicaciones. OpenTelemetry es un proyecto de la Cloud Native Computing Foundation (CNCF) y es compatible con una amplia gama de marcos y lenguajes de programación.

Para el envío de trazas, logs o métricas, las aplicaciones deben instrumentarse. Este trabajo es realizado por las librerías de OpenTelemetry.

OpenTelemetry no solo soporta la instrumentación de aplicaciones, sino que también podremos instrumentar infraestructura para entender un poco más en detalle cómo funciona la instrumentación. Veamos la siguiente imagen:

![otel](https://opentelemetry.io/img/otel-diagram.svg)

OTel Collector es la pieza de software que recopila datos de telemetría de las aplicaciones y servicios instrumentados. Los datos de telemetría se recopilan en un formato estándar llamado OpenTelemetry Protocol (OTLP). El collector luego puede procesar los datos de telemetría y exportarlos a una variedad de destinos, como bases de datos, sistemas de análisis y paneles de control.

## ¿Qué es Jeager UI?

![jeager](https://i.ibb.co/1mFnsJ1/JaegerUI.png)

Jaeger es una herramienta de trazado distribuido que permite visualizar y analizar las trazas de nuestras aplicaciones. Con Jaeger, podemos ver cómo las solicitudes fluyen a través de nuestros microservicios y dónde se producen los cuellos de botella o los errores. Algunas de sus características incluyen:

- Propagación de contexto distribuida
- Monitoreo de transacciones distribuidas
- Análisis de raíz de la causa
- Análisis de dependencia del servicio
- Optimización de rendimiento/latencia

Utilizaremos el componente Jeager UI, el cual nos permitirá visualizar las trazas enviadas por aplicaciones que instrumentemos con OpenTelemetry.

## Instrumentando aplicaciones con OpenTelemetry

Para instrumentar nuestros microservicios con OpenTelemetry, necesitamos inicializar el SDK de OpenTelemetry y configurarlo para recopilar métricas, logs y trazas. A continuación, se muestra un ejemplo de cómo podemos hacer esto en TypeScript.

Instalación. OpenTelemetry tiene un montón de dependencias que deberemos incluir dependiendo de nuestro caso, pero básicamente instalamos los componentes base de telemetría y sdk-node e instrumentaciones específicas de tecnologías que queremos hacer tracing.

```shell
npm install @opentelemetry/context-async-hooks \
    @opentelemetry/exporter-metrics-otlp-proto \
    @opentelemetry/exporter-trace-otlp-http \
    @opentelemetry/instrumentation-amqplib \
    @opentelemetry/instrumentation-express \
    @opentelemetry/instrumentation-http \
    @opentelemetry/instrumentation-pg \
    @opentelemetry/resources \
    @opentelemetry/sdk-metrics \
    @opentelemetry/sdk-node \
    @opentelemetry/sdk-trace-node \
    @opentelemetry/semantic-conventions
```

La siguiente función implementa la instrumentación básica de una aplicación Node.js. Esta función recolectará toda la información de métricas y trazas y las enviará a un servidor OTLP con el cual podremos visualizar los datos de forma gráfica.

```typescript
import { Logger } from "@nestjs/common";
import { metrics } from '@opentelemetry/api';
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { InstrumentationOption } from '@opentelemetry/instrumentation';
import { Resource } from "@opentelemetry/resources";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// Tipo de opciones para crear el SDK
type CreateSdkOptions = {
  serviceName: string // nombre del servicio el cual poderemos identificar
  serviceVersion: string,
  traceExporterOptions?: { url: string, headers?: any },
  metricExporterOptions?: { url: string, headers?: any },
  instrumentations?: InstrumentationOption[] // implementaciones por defecto que realizan la isntrumentacion de ciertas librerias sin necesidad de hacerlo por nosotros.
}

// Función para crear el SDK de OpenTelemetry
export function createSdk(options: CreateSdkOptions) {
  // Crea un recurso con información del servicio el cual puede ser identificado en el servico de telemetria que escojamos
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: options.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: options.serviceVersion,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'local-machine.spotify-clone'
  })

  // Crea exportadores para trazas y métricas
  const traceExporter = new OTLPTraceExporter(options.traceExporterOptions);
  const metricExporter = new OTLPMetricExporter(options.metricExporterOptions)

  // Inicializa el SDK de OpenTelemetry para Node.js
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: options.instrumentations as any
  });

  // Configura un lector de métricas para exportación periódica
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30000, // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
  });

  // Crea un proveedor de medidores para la aplicación
  const applicationMeterProvider = new MeterProvider({
    resource: resource,
  });
  // Asigna el lector de métricas al proveedor de medidores de la aplicación
  applicationMeterProvider.addMetricReader(metricReader);

  // Establece este proveedor como el proveedor global de medidores para la aplicación
  metrics.setGlobalMeterProvider(applicationMeterProvider);

  return sdk // Retorna el SDK configurado
}

// Función para iniciar OpenTelemetry
export function startOpenTelemetry(options: CreateSdkOptions) {
  // Crea el SDK de OpenTelemetry llamando a la función createSdk con opciones adicionales
  const sdk = createSdk({
    ...options,
    metricExporterOptions: {
      url: process.env.OTLP_TRACE_EXPORTER_URL,// URL para la exportación de métricas
    },
  })

  // Función para detener adecuadamente el SDK de OpenTelemetry
  const shutdownOtelSdk = () => {
    sdk
      .shutdown()
      .then(() => {
        Logger.log("OTEL SDK shut down successfully", "OpenTelemetrySdk")
        process.exit(0)
      })
      .catch(() => {
        Logger.log("OTEL SDK failed shut down", "OpenTelemetrySdk")
        process.exit(1)
      })
  }

  // Manejadores para las señales SIGTERM y SIGINT que llaman a la función de cierre
  process.on("SIGTERM", () => shutdownOtelSdk())
  process.on("SIGINT", () => shutdownOtelSdk())
  // Inicia el SDK de OpenTelemetry
  sdk.start()
  Logger.log("OTEL SDK started successfully", "startTelemetry")

}
```

## Ejemplo de trazas con una comunicación entre microservicios

Para ilustrar cómo podemos utilizar OpenTelemetry para mejorar la observabilidad de nuestros microservicios, vamos a utilizar un ejemplo de un clon de Spotify. Tenemos las siguientes aplicaciones:

- `mobile-bff`: Backend for frontend para aplicaciones móviles, expone los datos mediante GraphQL.
- `music-library-ms`: API Rest con la data de artistas, álbumes y canciones.

![arquitectura](https://i.ibb.co/6By7yYt/microservice-2-photo1.png)

Es un proceso básico que ilustrará una petición de un servicio a otro.

El código que se mostrará a continuación define la estructura básica y simplificada de las aplicaciones `mobile-bff` y `music-library-ms`, las cuales simularán la librería musical de Spotify.

> Si quieres ver en detalle el codigo puedes consultar el [repositorio](https://github.com/nullpointer-excelsior/microservices-architecture-nestjs)

## Servicio MobileBFF Spotify clone

Definimos las clases necesarias para levantar nuestro servicio GraphQL.

```typescript
// Model de Artist Graphql
@ObjectType()
export class Artist {

    @Field({ nullable: true })
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    photo?: string;

    @Field({ nullable: true })
    biography?: string;

    @Field(type =>[Album], { nullable: 'itemsAndList' })
    albums?: Album[]

}

// Resolver de Artist
@Resolver(of => Artist)
export class ArtistResolver {

    constructor(
        private artistService: ArtistService,
        private albumService: AlbumService
    ) {}

    @Span("ArtistResolver/query/artistById")
    @Query(returns => Artist)
    artistById(@Args('id') id: string) {
        return this.artistService.findById(id)
    }

    @Span("ArtistResolver/query/artists")
    @Query(returns => [Artist])
    artists() {
        return this.artistService.findAll()
    }

    @Span("ArtistResolver/field/album")
    @ResolveField()
    async albums(@Parent() artist: Artist) {
        return this.albumService.findByArtistId(artist.id)
    }

}
```

```typescript
// cliente http para conexion con el microservicio music-library-ms
@Injectable()
export class MusicLibraryCLient {

    private musiclibraryUrl = null

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) {
        this.musiclibraryUrl = this.config.get("MOBILE_BFF_MUSIC_LIBRARY_API")
    }

    @Span("MusicLibraryHttpClient/GET")
    get<T = any>(endopoint: string, config?: AxiosRequestConfig): Observable<T> {
        const url = `${this.musiclibraryUrl}/${endopoint}`
        return this.http.get(url, config).pipe(
            map(res => res.data)
        );
    }

}
// componente de tipo service para obtener los artistas de music-library-ms
@Injectable()
export class ArtistService {

  constructor(private client: MusicLibraryCLient) { }

  @Span("ArtistService/findById")
  findById(id: string): Observable<ArtistModel[]> {
    return this.client.get(`artists/${id}`)
  }

  @Span("ArtistService/findAll")
  findAll() {
    return this.client.get(`artists`)
  }

}
```

> Se ignoran las configuraciones de módulos, ya que salen del objetivo del artículo.

## Microservicio Music Library Spotify Clone

Nuestro Microservicio `music-library-ms` es una API Rest simple.

```typescript
// artist controller
@Controller('artists')
@ApiTags('Artists')
export class ArtistController {

  constructor(private artistService: ArtistService) { }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'All artists', type: [ArtistModel] })
  async getAllArtists(): Promise<ArtistModel[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an artist by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the artist' })
  @ApiResponse({ status: 200, description: 'The artist', type: ArtistModel })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  async getArtist(@Param('id') id: string): Promise<ArtistModel | undefined> {
    return await this.artistService.findById(id);
  }

}

// artist model
export class ArtistModel {

  @IsUUI()
  @IsNotEmpty()
  @ApiProperty({ description: 'The ID of the artist' })
  id: string;

  @IsString()
  @ApiProperty({ description: 'The name of the artist' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'The photo of the artist' })
  photo: string;

  @IsString()
  @ApiProperty({ description: 'The biography of the artist' })
  biography: string;

}

// ArtistService
@Injectable()
export class ArtistService {

    constructor(@InjectRepository(Artist) private repository: Repository<Artist>) { }

    @Span("ArtistService/findAll")
    findAll(): Promise<ArtistModel[]> {
        return this.repository.find();
    }

    @Span("ArtistService/findById")
    @NotFoundExceptionIfUndefined('Artist not found')
    findById(id: string): Promise<ArtistModel> {
        return this.repository.findOneBy({ id });
    }

}

// Artist ORM Entity
@Entity()
export class Artist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  photo: string;

  @Column()
  biography: string;

  @OneToMany(() => Song, song => song.artist)
  songs: Song[]

  @OneToMany(() => Album, album => album.artist)
  albums: Album[]

}

```

## Iniciando instrumentación de microservicios

La instrumentación debe instanciarse en el punto de entrada de la aplicación. Debemos hacer llamado de la función `startOpenTelemetry()` en la ejecución del archivo `main.ts`. Debemos iniciar esta función antes del método `bootstrap()` como en el siguiente ejemplo:

### mobile-bff `apps/mobile-bff/main.ts`

```typescript
// MOBILE-BFF Application
async function bootstrap() {
  const app = await NestFactory.create(MusicLibraryMsModule);
  // server implementation and more code...
}

startOpenTelemetry({
  serviceName: "mobile-bff",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(), // trazas http
    new ExpressInstrumentation({ // trazas express
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE] // se ignora trazas provenientes de middleware y request handlre de express
    }),
  ],
})

bootstrap();
```

### music-library-ms `apps/music-library-ms/main.ts`

```typescript
// MusicLibraryMS microservice
async function bootstrap() {

  const app = await NestFactory.create(MusicLibraryMsModule);
  // server implementation and more code...

}

startOpenTelemetry({
  serviceName: "music-library-ms",
  serviceVersion: "1.0",
  instrumentations: [
    new HttpInstrumentation(),
    new PgInstrumentation(), // trazas de postgres
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
```

Tanto `mobile-bff` como `music-library-ms` instrumentarán `HttpInstrumentation` y `ExpressInstrumentation`. Con esto lograremos que OpenTelemetry pueda asociar cualquier petición entre los 2 en una misma traza con una jerarquía incluida. `music-library-ms` instrumentará `PgInstrumentation` para obtener información sobre el motor PostgreSQL.

## Customizando Trazas con Spans

Un "Span" representa una porción de tiempo durante la cual una operación específica ocurre en una aplicación. Por ejemplo, cuando se inicia una solicitud HTTP en un servicio y se completa, también contienen información relevante sobre el tiempo que tomó la operación, metadatos contextualizados (como identificadores de servicio, identificadores de usuario, etc.), así como también pueden tener relaciones padre-hijo, lo que permite visualizar cómo las operaciones se relacionan entre sí en un entorno distribuido.

Para implementar Span podemos utilizar la librería `nestjs-otel`, la cual nos proporciona un conjunto de anotaciones y servicios de NestJS para instrumentar de forma fácil y limpia nuestras aplicaciones.

```bash
npm install nestjs-otel
```

Ahora en cualquier método podemos hacer uso del decorador `@Span`.

```typescript
@Span("ArtistService/findById")
findById(id: string): Promise<ArtistModel> {
  return this.repository.findOneBy({ id });
}
```

Además, podemos agregar atributos a nuestras trazas para proporcionar más contexto sobre las operaciones que estamos rastreando. Por ejemplo, podemos agregar más información o metadata a nestras trazas en `ArtistService` de la siguiente manera:

```typescript

@Injectable()
export class ArtistService {

    constructor(private readonly traceService: TraceService) {}

    // atributos mediante decorador
    @Span("ArtistService/findById", { attributes: { foo: 'bar' }})
    findById(id: string): Promise<ArtistModel> {
      return this.repository.findOneBy({ id });
    }

    // atributos mediante service
    async save(artist: CreateArtistRequest) {
      const currentSpan = this.traceService.getSpan(); // --> retrives current span, comes from http or @Span
      const saved = await this.repository.save(artist)
      await this.doSomething();
      currentSpan.addEvent('event 1');
      currentSpan.end(); // current span end
      const span = this.traceService.startSpan('sub_span'); // start new span
      span.setAttributes({ userId: 1 });
      await this.doSomethingElse();
      span.end();
      return saved
    }

    async doSomething() {
      // some random operation
    }

}

```

## Ejecución y Pruebas de trazas distribuidas

Finalizando con la implementación de OpenTelemetry, es hora de realizar un par de pruebas. Todo el código anterior con mayor detalle está en el siguiente [repositorio](https://github.com/nullpointer-excelsior/microservices-architecture-nestjs). Ahora sigue los siguientes pasos para probar el sistema:

> Necesitarás tener Docker corriendo en tu máquina local.

```bash
# Clonar el repositorio
git clone https://github.com/nullpointer-excelsior/microservices-architecture-nestjs

# Instalar dependencias
cd microservices-architecture-nestjs/
npm install
```

Ahora necesitaremos levantar la infraestructura y las aplicaciones:

```bash
# Levantar infraestructura
npm run start:infra 
# Iniciar mobile-bff
npm run start:mobile-bff
# Iniciar music-library-ms
npm run start:music-library
```

El comando `npm run start:infra` levantará también a Jeager UI. Ahora, si todo sale bien, tendrás 2 aplicaciones NestJs ejecutándose más la aplicación Jeager UI:

- `mobile-bff`: En la URL http://localhost:3014/graphql encontrarás el playground de GraphQL con el cual podrás ejecutar consultas.
- `music-library-ms`: En la URL http://localhost:3011/api encontrarás la definición de la API con Swagger con la que podrás interactuar con la API directamente.
- `Jeager UI`: En la URL http://localhost:16686 encontrarás Jaeger UI. Aquí es donde visualizaremos las trazas de las aplicaciones.

### Visualizando nuestra primera traza

Nos dirigimos a http://localhost:3014/graphql y realizaremos la siguiente query.

```gql
query {
  artists {
    name,
    albums {
      photo,
      songs {
        title,
      }
    }
  }
}
```

como se muestra en la imagen ![i1](https://i.ibb.co/Z8zwdn7/Screenshot-2023-11-27-at-15-46-41.png)

En este caso, no nos devolverá datos, pero habrá hecho una petición a `music-library-ms`, con esto nos basta.

### Visualizando trazas en Jeager UI

Nos dirigimos a http://localhost:16686 y en el buscador de servicios podremos filtrar nuestras trazas. En este caso, escogeremos `mobile-bff`. Si no vemos `mobile-bff` o `music-library-ms`, esperamos unos minutos y refrescamos.

![i2](https://i.ibb.co/qD97CYM/Screenshot-2023-11-27-at-15-47-15.png)

Ahora veremos las distintas trazas que llegaron a Jeager UI. Escogeremos la que tenga más spans asociados y expandiremos.

![i3](https://i.ibb.co/n3XH7Hd/Screenshot-2023-11-27-at-16-07-14.png)

Ahora podemos ver una jerarquía de spans realizados por ambas aplicaciones donde nos da una apreciación de tiempo como de atributos que pudiera contener las trazas.

![i4](https://i.ibb.co/LR0S8Xd/Screenshot-2023-11-27-at-15-47-00.png)

Toda la información que enviamos es personalizable. Deberás consultar la documentación de [OpenTelemetry](https://opentelemetry.io/docs/getting-started/dev/) o de la instrumentación en específico. Por ejemplo, aquí podemos visualizar la query realizada por `music-library-ms`.

![i5](https://i.ibb.co/1nxkV3S/Screenshot-2023-11-27-at-15-48-05.png)

## Conclusión

La implementación de trazas distribuidas con OpenTelemetry nos dará una ventaja al momento de resolver problemas en entornos distribuidos. Antes de diseñar microservicios o cualquier aplicación donde el entorno producctivo sea realmente crítico, debemos considerar cómo vamos a hacer seguimiento de estos sistemas. En este artículo abordamos solo el caso de trazas, pero la observabilidad en la ingeniería de software nos ayudará a:

- **Monitoreo de salud**: Evaluar el estado de los componentes distribuidos.
- **Identificar cuellos de botella**: Encontrar áreas de rendimiento deficiente.
- **Optimización de recursos**: Ajustar asignación de CPU, memoria, etc.
- **Seguimiento y trazabilidad**: Rastrear flujo de datos entre servicios.
- **Detección de problemas en tiempo real**: Configurar alertas para responder rápidamente.
- **Análisis de tendencias**: Identificar patrones y comportamientos históricos de los usuarios para toma de decisiones.
- **Automatización de respuestas**: Tomar decisiones automáticas según la demanda.
- **Optimización de la experiencia del usuario**: Mejorar rendimiento según interacciones.
- **Seguridad y detección de anomalías**: Identificar posibles ataques o brechas.
- **Evaluación del rendimiento a largo plazo**: Analizar para mejorar la arquitectura.


La observabilidad es un aspecto crucial para el desarrollo y la operación de microservicios. En este artículo vimos solo la capacidad de las trazas. OpenTelemetry nos proporciona las herramientas necesarias para recopilar y gestionar la telemetría de nuestras aplicaciones, lo que nos permite obtener una visión completa de nuestras aplicaciones. Con OpenTelemetry, podemos mejorar la calidad y el rendimiento de nuestras aplicaciones y resolver los problemas de manera más eficiente.
