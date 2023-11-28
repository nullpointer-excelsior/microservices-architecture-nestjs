# Arquitectura de microservicios con Nestjs

Este repositorio tiene como objetivo proporcionar ejemplos y guías sobre cómo implementar patrones de arquitectura de microservicios utilizando NestJS. Está inspirado en la complejidad y desafíos que presenta una plataforma como Spotify. Crearemos un clon que emulará las funcionalidades clave de la famosa plataforma de música. A través de este proyecto, podrás explorar las mejores prácticas, estructuras y conceptos clave para desarrollar aplicaciones escalables basadas en microservicios.

## Objetivo

El propósito principal de este proyecto es:

* Proporcionar ejemplos claros y detallados de cómo implementar patrones de arquitectura de microservicios utilizando NestJS.
* Presentar ejemplos prácticos que representen características clave de una plataforma de música, como la gestión de usuarios, autenticación, gestión de música y listas de reproducción.
* Facilitar un entorno de aprendizaje donde puedas comprender no solo los fundamentos de NestJS, sino también su aplicación práctica en un entorno de microservicios.

## Tecnologías empleadas:

* `NestJs`: Framework Node.js con TypeScript.
* `Docker`: Plataforma para crear y ejecutar aplicaciones en contenedores.
* `Postgres`: Sistema de gestión de bases de datos relacional.
* `MongoDB`: Base de datos NoSQL orientada a documentos. 
* `RabbitMQ`: Broker de mensajes para la comunicación entre microservicios.

## Monorepositorio con NestJs

NestJs nos da una manera sencilla de crear monorepositorios donde con simples instrucciones podremos crear librerías compartidas o aplicaciones. Nos ayudaremos de esto para poder, para más información, consultar la documentación de [workspaces de NestJs](https://docs.nestjs.com/cli/monorepo).

## Estructura de directorios

La estructura de carpetas es la siguiente:

* `apps`: aplicaciones nestjs en nuestro caso serán nuestros microservicios.
* `libs`: librerías de uso compartido por los microservicios para reutilizar componentes.
* `infrastructure`: todo lo relacionado a la infraestructura necesaria para que nuestros microservicios puedan ser ejecutados.
* `docs`: documentación de patrones y técnicas utilizados en microservicios.

## Ejecución de aplicaciones

Asegúrate de tener instalado:

* Node.js
* Docker

Instala las dependencias usando npm install.

```bash
npm install
```

> Todas las aplicaciones son configuradas mediante variables de ambiente definidas en el archivo `.env`, el archivo `infrastructure/local/docker-compose.yml` también lee estas variables. 

Para ejecutar los componentes del proyecto, tienes disponible los siguientes scripts:

```bash
# Instala las dependencias usando npm install.
npm install

# Construir la Aplicación
npm run build

# Formatear Código
npm run format

# Iniciar Infraestructura (Docker Compose)
npm run start:infra

# Detener Infraestructura (Docker Compose)
npm run stop:infra

# Iniciar Infraestructura de Pruebas de Extremo a Extremo
npm run start:e2e-infra

# Detener Infraestructura de Pruebas de Extremo a Extremo
npm run stop:e2e-infra

# Iniciar Componentes Individuales:

## Monolito de Spotify
npm run start:spotify-monolith

## Biblioteca de Música
npm run start:music-library

## Descubrimiento Musical
npm run start:discovery

## Cuentas
npm run start:accounts

## BFF Móvil
npm run start:mobile-bff

## Servicio de Correo
npm run start:mailing

# Ejecutar Pruebas de Extremo a Extremo

## Monolito de Spotify
npm run e2e:monolith

## Biblioteca de Música
npm run e2e:music-library

## BFF Móvil
npm run e2e:mobile-bff

## Descubrimiento Musical
npm run e2e:music-discovery

# Linting
npm run lint

# Ejecutar Pruebas Unitarias de todas las aplicaciones
npm test
```

## Arquitectura del proyecto:

Cada microservicio y componente se describe acá:

* `spotify-monolith`: Aplicación monolítica clon de Spotify que gestiona usuarios, la librería de canciones y las listas de reproducción.
* `music-library-ms`: Microservicio que gestiona la librería musical de artistas, álbumes, canciones y géneros de nuestro clon de Spotify.
* `music-discovery-ms`: Microservicio que gestiona radios y listas de reproducción destinado a que el usuario conozca nueva música.
* `accounts-ms`: Microservicio que gestiona las cuentas de usuario.
* `mobile-bff`: Backend For Frontend para aplicación móvil: encargada de obtener la librería musical, las listas de reproducción y radios, y exponer los datos como API GraphQL.
* `mailing-ms`: Microservicio que gestiona el envío de correos electrónicos.

## Módulos de aprendizaje:

* 1 - Diseño de aplicaciones
    * [Diseño de aplicaciones escalables y mantenibles](docs/how-to-build-scalable-and-maintainable-apps.md)
* 2 - Observabilidad
    * [Trazas distribuidas](docs/distributed-traces.md)
* XXX - **Work in progress...**

## Recursos adicionales

* [Documentación oficial de NestJS](https://docs.nestjs.com/)
* [Documentación de patrones de microservicios](https://microservices.io/patterns/index.html)

### Desarrollado por Benjamín