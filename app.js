// 1. Inicializa esta carpeta para que sea gobernada por NPM
// npm install
// npm init -y
// npm install (morgan, express, mongodb, ejs)

// 2. Instala los módulos de terceros express, morgan, mongodb y ejs
const express = require('express');
const morgan = require('morgan');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection string: el string donde especificamos usuario:contraseña y URL de conexión 
// Unique Resource Identifier
const uri = "mongodb+srv://criadomanzaneque:MSNvQed7qIZgA387@cluster0.fl8rdre.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }}
);

// Variable global para gestionar base de datos
let database;

// Crear instancia servidor Express
const app = express();

// MIDDLEWARES:
// Loguear peticiones del cliente
app.use(morgan('dev'));

// OTRAS CONFIGURACIONES
// Especificar a Express que quiero utilizar EJS como motor de plantillas
app.set('view engine', 'ejs');

// PETICIÓN GET
app.get("/", async (req, res) => {
     // Tenemos que hacer una consulta a la base de datos de MongoDB y traernos 10 películas cualesquiera, ordenarlas por fecha de lanzamiento de forma decreciente. 

     const movies = database.collection('movies');

     // Definir un objeto que va a contener la query a la base de datos y las opciones
    const { keyword, type, fromYear } = req.query;
    let query = {}
     const options = { sort: {year: -1}, limit: 10}
     

     // TODO 1: Ahora la palabra clave también tenemos que buscarla en el campo 'plot' y en el campo 'fullPlot' de los documentos
    if (keyword) {
        query.title = new RegExp(keyword, 'i'); // 'i' para que sea 
    }

    // TODO 2: Si el parámetro 'type' está informado (tiene valor), entonces tenemos que crear una nueva propiedad en la query (query.type) y asignarle el valor adecuado para buscar las películas también por tipo de filmación
    if (type) {
        query.type = type 
    }
    console.log("🚀 ~ app.get ~ type:", type)

    // TODO 3: Si el parámetro fromYear está informado....
    if (fromYear) {
        // Añadir criterio de búsqueda para que filtre a partir de las películas filmadas en el año formYear
        query.year = { $gte: Number(fromYear) }
    }

     // TODO 4: Si el parámetro toYear está informado....
    

     // Recuperar todas las películas con esa query y opciones
     const documents = await movies.find(query, options).toArray();
     console.log("🚀 ~ app.get ~ documents:", documents)


     // 2. Tenemos que pasar a la vista todos los documentos que hemos recuperado
     // 3. En el EJS tenemos que iterar por cada uno de los documentos, y para cada documento, mostrar titulo, imagen y año de lanzamiento (ver practica fototeca) 

     res.render("index", {
         documents
     });
    
})

// PUERTO DE ESCUCHA PARA EL SERVIDOR
app.listen(process.env.PORT || 3000, async ()=> {
    console.log("Servidor escuchando correctamente en el puerto 3000.")
    // Cuando levantamos el servidor nos conectamos a MongoDB
    try {
       await client.connect();
       
        // seleccionamos la base de datos
        database = client.db("sample_mflix");

        // Mensaje de confirmación de que nos hemos conectado a la base de datos
        console.log("Conexión a la base de datos OK.")

        // Query

    } catch (err){
        console.error(err);
    }
});