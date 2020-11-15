# Ciencias de la Computacion 8 - Projecto de IoT

## Implementacion de Middleware

### Isai Pashel - 17001030

Esta es una implementacion del middleware de un proyecto de Internet Of Things el cual emplea el funcionamiento de un sistema que controla el aire acondicionado, el cantelador, las cerraduras del hogar y las luces del interior de una casa.

El hardware que conforma este sistema son los siguientes:

- Switch para activar o desactivar las cerraduras
- Switch para encender o apagar las luces del interior
- Calentador
- Aire acondicianado


### Base de datos

La base de datos usada para este proyecto fue MongoDB.  
Para mas informacion o si deseas descargar del driver puedes acceder a su pagina oficial https://docs.mongodb.com/manual/mongo/

#### **Colecciones en MongoDB**  

Para la recopilacion de informacion tanto de los requests recibidos y los responses enviados son guardados en sus respectivas colecciones. Para este proyecto se han usado cuetro colecciones de las cuales son:  

Requests

```json
{
    "id": String,    //id del que envia el request
    "url": String,    //url del que envia el request
    "date": Date,     //fecha en formato ISO
    "type": String,   //tipo de request (search, info, change, etc)
    "data": {}        //cuerpo del request
}
```  

Responses  

```json
{
    "id": String,
    "url": String,
    "date": Date,
    "type": String,
    "request_id": ObjectId, // _id generado para el request al guardar en base de datos
    "data": {}
}
```

Changes (cambios por cada actualizacion del Virtual Device)

```json
{
    "status": Boolean,
    "text": String,
    "sensor": Integer,
    "date": Date
}
```

Eventos

```json
{
    "_id": ObjectId,
    "event": {},     //json enviado en el request
    "date": Date,
    "request_id": ObjectId
}
```

### Librerias usadas para Node.js  

Para la implementacion del servidor se usaron diferentes librerias que proporcionaban la capacidad de realizar algunas acciones de una manera mas facil las cuales fueron:

- **Express.js** (librerias para levantar el servidor y las rutas)
- **Moment.js**  (libreria para formatear fechas en formato ISO)
- **Axios**      (libreria para ejecutar requests a otros middlewares)
