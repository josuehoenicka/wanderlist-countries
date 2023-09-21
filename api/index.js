const Express = require("express");
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");

const app = Express();
app.use(cors());

const CONNECTION_STRING = "mongodb+srv://admin:josue221@cluster0.poghgon.mongodb.net/?retryWrites=true&w=majority"

const DATABASENAME = "wanderlist";
let database;

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connection successful !")
    });
})

/* GET */
app.get('/api/wanderlist/getCountries',(request, response) => {
    database.collection("wanderlistcollection").find({}).toArray((error, result) => {
        response.send(result);
    })
})

/* ADD */
app.post('/api/wanderlist/addCountry',multer().none(), (request, response) => {
    database.collection("wanderlistcollection").count({}, function(error, numOfDocs){
        database.collection("wanderlistcollection").insertOne({
            id: (numOfDocs + 1).toString(),
            description: request.body.newCountry
        });
        response.json("Country added successful !");
    });
});

/* DELETE */
app.delete('/api/wanderlist/deleteCountry', (request, response) => {
    database.collection("wanderlistcollection").deleteOne({
        id: request.query.id
    });
    response.json("Country deleted successful !");
});

