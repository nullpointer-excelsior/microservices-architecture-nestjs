# 🔍 Microservices: Observability in Microservices, a Practical Example of Distributed Traces

## 💡 Introduction

In the world of microservices, observability is a crucial aspect for understanding the behavior and performance of our applications. Observability allows us to collect and analyze data from different sources to gain a complete view of our applications. This holistic approach not only provides us with a thorough view of each component of our applications but also allows us to identify patterns, anomalies, and potential optimizations, thus contributing to strengthening the robustness and efficiency of our technology solutions.

In this article, we will address how to implement distributed traces on the flow of 2 applications in a microservices environment using OpenTelemetry and JaegerUI on a microservices system that emulates the Spotify platform. All with NestJS.

## 🏛️ The Foundations of Observability

When we delve into the world of observability, we will often hear the concept of MELT, which is an acronym referring to the four pillars of observability: Metrics, Events, Logs, and Traces.

- **Metrics**: numerical data representing the state of our application at a given moment.
- **Events**: records of significant actions or changes in our application.
- **Logs**: detailed records of our application's activities.
- **Traces**: visual representations of how requests flow through our application.

It may be clearer visually with the following image:

![meltex](https://i.ibb.co/FXYNHVf/melt.png)

## 🔗 The Importance of Traces in Distributed Systems

Traces in a distributed application are fundamental because they offer a detailed window into the flow of data and actions between its various components. These traces allow us to follow the path of a request or process through the various services, facilitating problem detection, error debugging, performance optimization, and holistic understanding of the interaction between distributed elements.

## ❓ What is OpenTelemetry?

[OpenTelemetry](https://opentelemetry.io/docs/) is a set of APIs, libraries, and agents that enable the collection and management of telemetry (metrics, logs, traces) from our applications. OpenTelemetry is a Cloud Native Computing Foundation (CNCF) project and is compatible with a wide range of frameworks and programming languages.

For sending traces, logs, or metrics, applications must be instrumented. This work is done by OpenTelemetry libraries.

OpenTelemetry not only supports application instrumentation but also allows us to instrument infrastructure to understand in more detail how instrumentation works. Let's look at the following image:

![otel](https://opentelemetry.io/img/otel-diagram.svg)

The OTel Collector is the piece of software that collects telemetry data from instrumented applications and services. Telemetry data is collected in a standard format called OpenTelemetry Protocol (OTLP). The collector can then process the telemetry data and export it to a variety of destinations, such as databases, analytics systems, and dashboards.

## ❓ What is Jaeger UI?

![jaeger](https://i.ibb.co/1mFnsJ1/JaegerUI.png)

Jaeger is a distributed tracing tool that allows you to visualize and analyze the traces of our applications. With Jaeger, we can see how requests flow through our microservices and where bottlenecks or errors occur. Some of its features include:

- Distributed context propagation
- Distributed transaction monitoring
- Root cause analysis
- Service dependency analysis
- Performance/latency optimization

We will use the Jaeger UI component, which will allow us to visualize traces sent by applications instrumented with OpenTelemetry.

## 🔧 Instrumenting Applications with OpenTelemetry

To instrument our microservices with OpenTelemetry, we need to initialize the OpenTelemetry SDK and configure it to collect metrics, logs, and traces. Below is an example of how we can do this in TypeScript.

Installation. OpenTelemetry has a lot of dependencies that we will need to include depending on our case, but basically we install the base telemetry components and sdk-node and specific technology instrumentations we want to trace.

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

The following function implements the basic instrumentation of a Node.js application. This function will collect all metrics and trace information and send it to an OTLP server where we can visualize the data graphically.

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

// Options type for creating the SDK
type CreateSdkOptions = {
  serviceName: string // service name for identification in the telemetry service
  serviceVersion: string,
  traceExporterOptions?: { url: string, headers?: any },
  metricExporterOptions?: { url: string, headers?: any },
  instrumentations?: InstrumentationOption[] // default implementations that perform instrumentation of certain libraries without needing to do it ourselves
}

// Function to create the OpenTelemetry SDK
export function createSdk(options: CreateSdkOptions) {
  // Creates a resource with service information that can be identified in the telemetry service of our choice
  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: options.serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: options.serviceVersion,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'local-machine.spotify-clone'
  })

  // Creates exporters for traces and metrics
  const traceExporter = new OTLPTraceExporter(options.traceExporterOptions);
  const metricExporter = new OTLPMetricExporter(options.metricExporterOptions)

  // Initializes the OpenTelemetry SDK for Node.js
  const sdk = new NodeSDK({
    resource,
    traceExporter,
    contextManager: new AsyncLocalStorageContextManager(),
    instrumentations: options.instrumentations as any
  });

  // Sets up a metric reader for periodic export
  const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 30000, // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
  });

  // Creates a meter provider for the application
  const applicationMeterProvider = new MeterProvider({
    resource: resource,
  });
  // Assigns the metric reader to the application meter provider
  applicationMeterProvider.addMetricReader(metricReader);

  // Sets this provider as the global meter provider for the application
  metrics.setGlobalMeterProvider(applicationMeterProvider);

  return sdk // Returns the configured SDK
}

// Function to start OpenTelemetry
export function startOpenTelemetry(options: CreateSdkOptions) {
  // Creates the OpenTelemetry SDK by calling createSdk with additional options
  const sdk = createSdk({
    ...options,
    metricExporterOptions: {
      url: process.env.OTLP_TRACE_EXPORTER_URL,// URL for metric export
    },
  })

  // Function to properly shut down the OpenTelemetry SDK
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

  // Handlers for SIGTERM and SIGINT signals that call the shutdown function
  process.on("SIGTERM", () => shutdownOtelSdk())
  process.on("SIGINT", () => shutdownOtelSdk())
  // Starts the OpenTelemetry SDK
  sdk.start()
  Logger.log("OTEL SDK started successfully", "startTelemetry")

}
```

## 📦 Example of Traces with Inter-Microservice Communication

To illustrate how we can use OpenTelemetry to improve the observability of our microservices, we will use a Spotify clone example. We have the following applications:

- `mobile-bff`: Backend for frontend for mobile applications, exposes data via GraphQL.
- `music-library-ms`: REST API with artist, album, and song data.

![architecture](https://i.ibb.co/6By7yYt/microservice-2-photo1.png)

It is a basic process that will illustrate a request from one service to another.

The code shown below defines the basic and simplified structure of the `mobile-bff` and `music-library-ms` applications, which will simulate the Spotify music library.

> If you want to see the code in detail, you can check the [repository](https://github.com/nullpointer-excelsior/microservices-architecture-nestjs)

## 📱 MobileBFF Service Spotify Clone

We define the necessary classes to set up our GraphQL service.

```typescript
// Artist GraphQL Model
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

// Artist Resolver
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
// HTTP client for connection with the music-library-ms microservice
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
// service-type component to get artists from music-library-ms
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

> Module configurations are ignored as they are outside the scope of this article.

## 🎵 Music Library Microservice Spotify Clone

Our `music-library-ms` microservice is a simple REST API.

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

## 🚀 Starting Microservice Instrumentation

Instrumentation must be instantiated at the application entry point. We need to call the `startOpenTelemetry()` function in the `main.ts` file execution. We must start this function before the `bootstrap()` method as in the following example:

### 📱 mobile-bff `apps/mobile-bff/main.ts`

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
    new HttpInstrumentation(), // http traces
    new ExpressInstrumentation({ // express traces
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE] // ignore traces from express middleware and request handler
    }),
  ],
})

bootstrap();
```

### 🎵 music-library-ms `apps/music-library-ms/main.ts`

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
    new PgInstrumentation(), // postgres traces
    new ExpressInstrumentation({
      ignoreLayersType: [ExpressLayerType.REQUEST_HANDLER, ExpressLayerType.MIDDLEWARE]
    }),
  ],
})

bootstrap();
```

Both `mobile-bff` and `music-library-ms` will instrument `HttpInstrumentation` and `ExpressInstrumentation`. With this, we will achieve OpenTelemetry being able to associate any request between the two in the same trace with an included hierarchy. `music-library-ms` will instrument `PgInstrumentation` to get information about the PostgreSQL engine.

## 🎯 Customizing Traces with Spans

A "Span" represents a portion of time during which a specific operation occurs in an application. For example, when an HTTP request is initiated in a service and completed, they also contain relevant information about the time the operation took, contextualized metadata (such as service identifiers, user identifiers, etc.), and can also have parent-child relationships, allowing you to visualize how operations relate to each other in a distributed environment.

To implement Spans, we can use the `nestjs-otel` library, which provides a set of NestJS annotations and services to easily and cleanly instrument our applications.

```bash
npm install nestjs-otel
```

Now we can use the `@Span` decorator on any method.

```typescript
@Span("ArtistService/findById")
findById(id: string): Promise<ArtistModel> {
  return this.repository.findOneBy({ id });
}
```

Additionally, we can add attributes to our traces to provide more context about the operations we are tracking. For example, we can add more information or metadata to our traces in `ArtistService` as follows:

```typescript

@Injectable()
export class ArtistService {

    constructor(private readonly traceService: TraceService) {}

    // attributes via decorator
    @Span("ArtistService/findById", { attributes: { foo: 'bar' }})
    findById(id: string): Promise<ArtistModel> {
      return this.repository.findOneBy({ id });
    }

    // attributes via service
    async save(artist: CreateArtistRequest) {
      const currentSpan = this.traceService.getSpan(); // --> retrieves current span, comes from http or @Span
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

## 🧪 Running and Testing Distributed Traces

Finishing the OpenTelemetry implementation, it is time to run a couple of tests. All the code above with more detail is in the following [repository](https://github.com/nullpointer-excelsior/microservices-architecture-nestjs). Now follow these steps to test the system:

> You will need Docker running on your local machine.

```bash
# Clone the repository
git clone https://github.com/nullpointer-excelsior/microservices-architecture-nestjs

# Install dependencies
cd microservices-architecture-nestjs/
npm install
```

Now we need to start the infrastructure and applications:

```bash
# Start infrastructure
npm run start:infra 
# Start mobile-bff
npm run start:mobile-bff
# Start music-library-ms
npm run start:music-library
```

The `npm run start:infra` command will also start Jaeger UI. Now, if everything goes well, you will have 2 NestJS applications running plus the Jaeger UI application:

- `mobile-bff`: At the URL http://localhost:3014/graphql you will find the GraphQL playground where you can execute queries.
- `music-library-ms`: At the URL http://localhost:3011/api you will find the API definition with Swagger with which you can interact with the API directly.
- `Jaeger UI`: At the URL http://localhost:16686 you will find Jaeger UI. This is where we will visualize the application traces.

### 🔍 Visualizing Our First Trace

We go to http://localhost:3014/graphql and execute the following query.

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

as shown in the image ![i1](https://i.ibb.co/Z8zwdn7/Screenshot-2023-11-27-at-15-46-41.png)

In this case, it will not return data, but it will have made a request to `music-library-ms`, which is enough for us.

### 📊 Visualizing Traces in Jaeger UI

We go to http://localhost:16686 and in the service search we can filter our traces. In this case, we will choose `mobile-bff`. If we do not see `mobile-bff` or `music-library-ms`, we wait a few minutes and refresh.

![i2](https://i.ibb.co/qD97CYM/Screenshot-2023-11-27-at-15-47-15.png)

Now we will see the different traces that arrived at Jaeger UI. We will choose the one with the most associated spans and expand it.

![i3](https://i.ibb.co/n3XH7Hd/Screenshot-2023-11-27-at-16-07-14.png)

Now we can see a hierarchy of spans performed by both applications, which gives us an appreciation of time as well as attributes that the traces might contain.

![i4](https://i.ibb.co/LR0S8Xd/Screenshot-2023-11-27-at-15-47-00.png)

All the information we send is customizable. You should consult the [OpenTelemetry](https://opentelemetry.io/docs/getting-started/dev/) documentation or the specific instrumentation. For example, here we can visualize the query performed by `music-library-ms`.

![i5](https://i.ibb.co/1nxkV3S/Screenshot-2023-11-27-at-15-48-05.png)

## 🏁 Conclusion

Implementing distributed traces with OpenTelemetry will give us an advantage when resolving problems in distributed environments. Before designing microservices or any application where the production environment is truly critical, we must consider how we will track these systems. In this article we only covered the case of traces, but observability in software engineering will help us:

- **Health monitoring**: Evaluate the state of distributed components.
- **Identify bottlenecks**: Find areas of poor performance.
- **Resource optimization**: Adjust CPU, memory, etc. allocation.
- **Tracking and traceability**: Track data flow between services.
- **Real-time problem detection**: Set up alerts to respond quickly.
- **Trend analysis**: Identify patterns and historical user behaviors for decision-making.
- **Response automation**: Make automatic decisions based on demand.
- **User experience optimization**: Improve performance based on interactions.
- **Security and anomaly detection**: Identify potential attacks or breaches.
- **Long-term performance evaluation**: Analyze to improve architecture.


Observability is a crucial aspect for the development and operation of microservices. In this article we only saw the capability of traces. OpenTelemetry provides the necessary tools to collect and manage telemetry from our applications, allowing us to get a complete view of our applications. With OpenTelemetry, we can improve the quality and performance of our applications and resolve issues more efficiently.
