# Microservices Architecture with Nestjs

Con este proyecto podras aprender patrones de arquitectura empleados en microservicios con NestJs. Crearemos un clon de 
Spotify con una arquitectura distribuida

## Tecnologias empleadas:

* NestJs
* events architecture
* docker-compose
* postgres
* rabbitmq
* mongodb

## Modulos de aprendizaje:

* 1 - Diseño de aplicaciones escalables y mantenibles
* 2 - Observabilidad
* 3 - Comunicacion entre microservicios: Async and Sync
* 4 - Protocolos de Acceso a microservicios
* 5 - API Gateway
    * building a API GAteway
    * Configuring a Ngnx server
    * Using Kong 
* 6 - User managment in microservices
* 7 - Security in API gateway
* Patrones de resilencia
* 8 - Escalando aplicaciones
* 9 - Caching request
* 10 - CQRS for read and queries 
* 11 - Queues
* 12 - EventSourcing




## Aplicaciones disponibles:

* `spotify-monolith`: Aplicacion monolitica clone de spotify la cual gestiona usuarios la libreria de canciones y las playlist.
* `music-library-ms`: Microservicio que gestiona la libreria musical de artistas, albumens canciones y generos de nuestro clone de spotify
* `music-discovery-ms`: Microservicio que gestiona radios y playlist destinado a que el usuario conozca nueva musica
* `accounts-ms`: Microservicio que gestiona las cuentas de usuario
* `mobile-bff`: Backend For Frontend para aplicacion mobile: encoragada de obtener la libreria musical los playlist y radios y exponer los datos como api graphql´
* `mailing-ms`: Microservicio que gestiona el envio de correos electronicos.

