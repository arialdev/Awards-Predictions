var colors = require('colors');
const config = require('./config.json');

var userRoutes = require('./api/routes/userRoutes');
var awardEventRoutes = require('./api/routes/awardRoutes');
var categoryRoutes = require('./api/routes/categoryRoutes');
const dbInitializer = require('./databaseInitializator');

var express = require('express'),
    app = express(),
    port = process.env.PORT || config.serverPort,
    mongoose = require('mongoose'),

    //created models loading here
    User = require('./api/models/user'),
    Category = require('./api/models/category'),
    Nominee = require('./api/models/nominee'),
    AwardEvent = require('./api/models/awardEvent'),
    bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.DBuri}:${config.DBPort}/${config.DBSchema}`, {useFindAndModify: false}).then(() => {
    new Promise(r => setTimeout(r, 500)).then(() => {
            if (config["create-drop"]) {
                initializeDatabase().then(() => console.log(`Database initialized: ${config.DBSchema}`));
            }
        }
    )
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// registering the routes
userRoutes(app);
awardEventRoutes(app);
categoryRoutes(app);


app.listen(port);
console.log(('AwardsPredictions API server started on: '.bold.brightBlue + port.toString().bold.brightYellow));

async function initializeDatabase() {
    console.log(`Resetting database: ${config.DBSchema}`);
    await mongoose.connection.db.dropDatabase();
    console.log(`Database dropped: ${config.DBSchema}`);
    await dbInitializer.loadData;
}