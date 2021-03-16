const path = require("path");

var colors = require('colors');
const config = require('./config.json');

var userRoutes = require('./api/routes/userRoutes');
var awardEventRoutes = require('./api/routes/awardRoutes');
var categoryRoutes = require('./api/routes/categoryRoutes');
// var nomineeRoutes = require('./api/routes/nomineeRoutes');
var voteRoutes = require('./api/routes/voteRoutes');


const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || config.serverPort;
const mongoose = require('mongoose');

//created models loading here
User = require('./api/models/user');
Category = require('./api/models/category');
Nominee = require('./api/models/nominee');
AwardEvent = require('./api/models/awardEvent');
Vote = require('./api/models/vote');
bodyParser = require('body-parser');

global.appRoot = path.resolve(__dirname);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.DBuri}:${config.DBPort}/${config.DBSchema}`, {
    useFindAndModify: false,
    useNewUrlParser: true, useUnifiedTopology: true
},).then(
    () => {
        if (config["create-drop"]) {
            initializeDatabase().then(() => console.log(`Database initialized: ${config.DBSchema}`));
        }
    },
    (err) => console.log(err)
);
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// registering the routes
userRoutes(app);
awardEventRoutes(app);
categoryRoutes(app);
voteRoutes(app);


app.listen(port);
console.log(('AwardsPredictions API server started on: '.bold.brightBlue + port.toString().bold.brightYellow));

async function initializeDatabase() {
    // console.log(`Resetting database: ${config.DBSchema}`);
    // await mongoose.connection.db.dropDatabase();
    // console.log(`Database dropped: ${config.DBSchema}`);

    // console.log(`initializing database: ${config.DBSchema}`);
    console.log(`Uploading Oscars...`)

    // Initializing awards
    const awards = [{
        'name': "Oscars",
        'year': 2021,
        'edition': 93,
        'pic': 'https://www.brandingmag.com/wp-content/uploads/2013/12/the-academy-oscars-new-logo-2.jpg',
    }];
    let promises = [];
    await awards.forEach((award) => {
        promises.push((new AwardEvent(award)).save());
    })
    let OSCARS = (await Promise.all(promises))[0];

    // Initializing categories
    const categories = [
        {
            'name': "Actor in a leading role",
            'awardEvent': OSCARS._id,
        },

        {
            'name': "Actor in a supporting role",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Actress in a leading role",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Actress in a supporting role",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Animated feature film",
            'awardEvent': OSCARS._id
        },
        {
            'name': "Cinematography",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Costume design",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Directing",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Documentary (feature)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Documentary (short subject)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Film editing",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "International feature film",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Makeup and hairstyling",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Music (original score)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Music (original song)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Best picture",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Production design",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Short film (animated)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Short film (live action)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Sound",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Visual effects",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Writing (Adapted screenplay)",
            'awardEvent': OSCARS._id,
        },
        {
            'name': "Writing (original screenplay)",
            'awardEvent': OSCARS._id,
        }];

    //Create all the categories referring to their belonged AwardEvent
    promises = [];
    await categories.forEach((category) => {
        promises.push((new Category(category)).save());
    })


    //Update the previous AwardEvent so it can refers to their just created categories
    OSCARS.categories = await Promise.all(promises);
    await OSCARS.save();
    // let GG_CATEGORIES = await Promise.all(promises);
    // GOLDEN_GLOBES = await AwardEvent.findByIdAndUpdate(GOLDEN_GLOBES._id, {$set: {categories: GG_CATEGORIES}}, {new: true}); //other way to do it

    const nominees = [
        /** FIRST CATEGORY **/
        {
            'name': 'Riz Ahmed',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTcxMTQ4MzY2Nl5BMl5BanBnXkFtZTgwMzAxOTY3MjI@.jpg',
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm1981893',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chadwick Boseman',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTk2OTY5MzcwMV5BMl5BanBnXkFtZTgwODM4MDI5MjI@.jpg',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm1569276',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Anthony Hopkins',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTg5ODk1NTc5Ml5BMl5BanBnXkFtZTYwMjAwOTI4.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0000164',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Gary Oldman',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTc3NTM4MzQ5MV5BMl5BanBnXkFtZTcwOTE4MDczNw@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0000198',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Steven Yeun',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjE4YmU2MTItMjE0ZC00Y2YxLWJkYWMtOTNiMTc0MDFjNjJlXkEyXkFqcGdeQXVyMjQwMDg0Ng@@.jpg',
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm3081796',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        /** SECOND CATEGORY **/
        {
            'name': 'Sacha Baron Cohen',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTkzMTY4Nzc2NF5BMl5BanBnXkFtZTgwODc3MDI2MDE@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/name/nm0056187',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Daniel Kaluuya',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTk1MzgzOTg5OV5BMl5BanBnXkFtZTcwNDQ4NjMxOA@@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm2257207',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Leslie Odom Jr.',
            'pic': 'https://www.gannett-cdn.com/presto/2018/09/04/PCIN/f62e816f-5d0d-4503-b97c-40de763e2d75-LOJ_1_1.jpg',
            'movie': 'One Night in Miami...',
            'link': 'https://www.imdb.com/name/nm0705152',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Paul Raci',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZDk1NGJiOGYtYWJlMi00M2YwLWE1NzQtOTZiZjJlNTUwZmRkXkEyXkFqcGdeQXVyMTQ5NDQ5Mw@@.jpg',
            'movie': 'Sound of metal',
            'link': 'https://www.imdb.com/name/nm0001467',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lakeith Stanfield',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTU3NTg3MTc5NV5BMl5BanBnXkFtZTgwNzUzMzg1MzI@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm3147751/',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        /** THIRD CATEGORY **/
        {
            'name': 'Viola Davis',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNzUxNjM4ODI1OV5BMl5BanBnXkFtZTgwNTEwNDE2OTE@.jpg',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm0205626',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Andra Day',
            'pic': 'https://pyxis.nymag.com/v1/imgs/e31/386/7a47d1fb4821fd26466ad51eac8d10f5f8-andra-day-01.w710.jpg',
            'movie': 'The United States vs. Billie Holiday',
            'link': 'https://www.imdb.com/name/nm7363531',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Vanessa Kirby',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYzUzNjkwMjMtODRiNi00ZTliLWE3Y2ItMDJmZmFmNjg1YTMyXkEyXkFqcGdeQXVyMjQwMDg0Ng@@.jpg',
            'movie': 'Pieces of a Woman',
            'link': 'https://www.imdb.com/name/nm3948952',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Frances McDormand',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMjI3NzgxNjYzOF5BMl5BanBnXkFtZTgwNTIxMjExNzE@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm0000531',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Carey Mulligan',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjQ1NGM2ODUtODc3Ny00ZjdhLTljNzEtMmY2M2M2MDY2Y2IzXkEyXkFqcGdeQXVyNzg5MzIyOA@@.jpg',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm1659547',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        /** FOURTH CATEGORY **/
        {
            'name': 'Maria Bakalova',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMGRlNjgzNjAtMzkyMS00YmU5LWE5ODYtMDIzNmE1MmRmYzVmXkEyXkFqcGdeQXVyMTA1NDMzMDM4.jpg',
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/name/nm7210025',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Glenn Close',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTEwNDk5MTU2NTNeQTJeQWpwZ15BbWU3MDczNjEzMTM@.jpg',
            'movie': 'Hillbilly Elegy',
            'link': 'https://www.imdb.com/name/nm0000335',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Olivia Colman',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTY4MzU2ODIzNl5BMl5BanBnXkFtZTgwMTM2OTA1NzM@.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm1469236',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Amanda Seyfried',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTc0MTE0Mzc5MV5BMl5BanBnXkFtZTgwMTc1NzgwNjE@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm1086543',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Youn Yuh-jung',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTcyMDI1NDk4NV5BMl5BanBnXkFtZTcwNzM2Mzc3NA@@.jpg',
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm0950926',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        /** FIFTH CATEGORY **/
        {
            'name': 'Onward',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTZlYzk3NzQtMmViYS00YWZmLTk5ZTEtNWE0NGVjM2MzYWU1XkEyXkFqcGdeQXVyNDg4NjY5OTQ@.jpg',
            'movie': 'Onward',
            'link': 'https://www.imdb.com/title/tt7146812',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Over the Moon',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTI0ZjVhM2ItMmFkOS00ZmFiLTg4NGQtODJjNTZmMDYxMWMyXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Over the Moon',
            'link': 'https://www.imdb.com/title/tt7488208',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A Shaun the Sheep Movie: Farmageddon',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTdjZjBkMDMtODBlNi00N2E0LWE1OGItOTgxODNmMDkzNGJmXkEyXkFqcGdeQXVyNjg2NjQwMDQ@.jpg',
            'movie': 'A Shaun the Sheep Movie: Farmageddon',
            'link': 'https://www.imdb.com/title/tt6193408',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Soul',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YzUtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@.jpg',
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/tt2948372',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Wolfwalkers',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTA4MWQ4NGUtOGQ0MS00M2QyLWE5MDItZWM2YzA0ZDgxZTA2XkEyXkFqcGdeQXVyNjY1MTg4Mzc@.jpg',
            'movie': 'Wolfwalkers',
            'link': 'https://www.imdb.com/title/tt5198068',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        /** SIXTH CATEGORY **/
        {
            'name': 'Sean Bobbitt',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTYwNWNmM2UtNDhlOC00ZGQzLWI1MTMtMmZlMTFjM2Y1N2ZhXkEyXkFqcGdeQXVyMTY5Nzc4MDY@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Erik Messerschmidt',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Dariusz Wolski',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDNlNmVlNDItMjE3Yi00ZTA3LWIyOTktNDhhMGFlZjk5ZDQ0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/tt6878306',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Joshua James Richards',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDRiZWUxNmItNDU5Yy00ODNmLTk0M2ItZjQzZTA5OTJkZjkyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9620292',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Phedon Papamichael',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYjYzOGE1MjUtODgyMy00ZDAxLTljYTgtNzk0Njg2YWQwMTZhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        /** SEVENTH CATEGORY **/
        {
            'name': 'Alexandra Byrne',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOGRiODEzM2QtOTUyYi00MWRlLTg4MzMtZGI0YmUzNWUyMjQ0XkEyXkFqcGdeQXVyMDA4NzMyOA@@.jpg',
            'movie': 'Emma',
            'link': 'https://www.imdb.com/name/nm0126107',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ann Roth',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTBlZGY1OTAtN2RjMC00ZThiLWFiZmUtN2VkOGMxNmMyYjQwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm0744778/',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trish Summerville',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Bina Daigeler',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNDliY2E1MjUtNzZkOS00MzJlLTgyOGEtZDg4MTI1NzZkMTBhXkEyXkFqcGdeQXVyNjMwMzc3MjE@.jpg',
            'movie': 'Mulan',
            'link': 'https://www.imdb.com/name/nm0197257',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Massimo Cantini Parrini',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNzgxNWJiOWQtZDA5Mi00NjBkLWIxMzUtZTg3Yjk5NjYyMDZjXkEyXkFqcGdeQXVyMDA4NzMyOA@@.jpg',
            'movie': 'Pinocchio',
            'link': 'https://www.imdb.com/name/nm1964768',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        /** EIGHTH CATEGORY **/
        {
            'name': 'Thomas Vinterberg',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTAzNzE4OTAwMTdeQTJeQWpwZ15BbWU2MDEwNjMyNQ@@.jpg',
            'movie': 'Another Round',
            'link': 'https://www.imdb.com/name/nm0899121',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'David Fincher',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTc1NDkwMTQ2MF5BMl5BanBnXkFtZTcwMzY0ODkyMg@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0000399',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lee Isaac Chung',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMGIzMGJhYmQtZDYwYy00OWVmLWFiMGMtNzEwMDk1NTNhOTRhXkEyXkFqcGdeQXVyNzY1ODU1OTk@.jpg',
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm1818032',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMWZlMjc3M2MtMDFlYy00OWIwLTkxMTUtOWYzNGU5ZmQ1MzgwXkEyXkFqcGdeQXVyMTk2ODc0MjY@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm2125482',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emerald Fennell',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNWRmYTIxNjYtN2JiMy00NTM3LTlkZTItZjI5YmZjMTZiZmMwXkEyXkFqcGdeQXVyMjMyMDMyNjI@.jpg',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm2193504',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        /** NINTH CATEGORY **/
        {
            'name': 'Collective',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTZlYzk3NzQtMmViYS00YWZmLTk5ZTEtNWE0NGVjM2MzYWU1XkEyXkFqcGdeQXVyNDg4NjY5OTQ@.jpg',
            'movie': 'Collective',
            'link': 'https://www.imdb.com/title/tt10706602',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Crip camp',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTNlMDI3MGYtY2FmNy00ZDdmLTkzZDMtMDg1MWYyM2M4YzQxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Crip camp',
            'link': 'https://www.imdb.com/title/tt8923484',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The mole agent',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYWI1MGQ3ZDktZmNhYi00MzY4LWFkMTQtZTA2YTgzYWViM2ZjXkEyXkFqcGdeQXVyMTA3MDk2NDg2.jpg',
            'movie': 'The mole agent',
            'link': 'https://www.imdb.com/title/tt11394298',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'My octopus teacher',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZWZlODNlYWUtZjY2Ni00YzdiLTkwNmEtZmY5MmY1MDI0YWQyXkEyXkFqcGdeQXVyNjEwNTM2Mzc@.jpg',
            'movie': 'My octopus teacher',
            'link': 'https://www.imdb.com/title/tt12888462',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'TIME',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNmNjMTg5M2QtNTMxZS00ZjQxLWFjNTgtZTIxZTQ5OTI2NGJjXkEyXkFqcGdeQXVyODE0OTU5Nzg@.jpg',
            'movie': 'TIME',
            'link': 'https://www.imdb.com/title/tt11416746',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        /** TENTH CATEGORY **/
        {
            'name': 'Colette',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTg5M2MxYzAtZjUwMi00MzRjLTkxNTItZmNjYzUxZjI3YzI3XkEyXkFqcGdeQXVyNDY2MjcyOTQ@.jpg',
            'movie': 'Colette',
            'link': 'https://www.imdb.com/title/tt5437928',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A concerto is a conversation',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZDVjMjc3YzQtYmQ5MC00OTg0LWE3NTAtOTM5OGM4YTY5Mzc5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'A concerto is a conversation',
            'link': 'https://www.imdb.com/title/tt13793326l',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Do not split',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMWE4MWRiMTEtMDBjMS00OTU0LTg5YjAtNDNiZTQxNDNlMTk5XkEyXkFqcGdeQXVyNTc0MDU0MDA@.jpg',
            'movie': 'Do not split',
            'link': 'https://www.imdb.com/title/tt11512676',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Hunger ward',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYWFjNjlmMTAtNGIyYy00MTJiLWFlNTItYWIxODQ2OTA3ZTBjXkEyXkFqcGdeQXVyNzMxMTE1NA@@.jpg',
            'movie': 'Hunger ward',
            'link': 'https://www.imdb.com/title/tt12979636',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A Love Song for Latasha',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYzBlOGE3Y2QtMDMyZS00NTg2LTk1MzUtMmFhMTFmODBlNDc0XkEyXkFqcGdeQXVyNjEwNTM2Mzc@.jpg',
            'movie': 'A Love Song for Latasha',
            'link': 'https://www.imdb.com/title/tt8993180',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        /** ELEVENTH CATEGORY **/
        {
            'name': 'Yorgos Lamprinos',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGJhNWRiOWQtMjI4OS00ZjcxLTgwMTAtMzQ2ODkxY2JkOTVlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0487166',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDRiZWUxNmItNDU5Yy00ODNmLTk0M2ItZjQzZTA5OTJkZjkyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9770150',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Frédéric Thoraval',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZDViMzBiNGMtZTIyNS00NzI4LWE3NDMtNmM1NDk0NzBlMWRlXkEyXkFqcGdeQXVyMTA2MDU0NjM5.jpg',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm1754850',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mikkel E. G. Nielsen',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjcyYjg0M2ItMzMyZS00NmM1LTlhZDMtN2MxN2RhNWY4YTkwXkEyXkFqcGdeQXVyNjY1MTg4Mzc@.jpg',
            'movie': 'Sound of metal',
            'link': 'https://www.imdb.com/name/nm1182055',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Alan Baumgarten',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYjYzOGE1MjUtODgyMy00ZDAxLTljYTgtNzk0Njg2YWQwMTZhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt8993180',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWELFTH CATEGORY**/
        {
            'name': 'Another Round (Denmark)',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTNjM2Y2ZjgtMDc5NS00MDQ1LTgyNGYtYzYwMTAyNWQwYTMyXkEyXkFqcGdeQXVyMjE4NzUxNDA@.jpg',
            'movie': 'Another Round (Denmark)',
            'link': 'https://www.imdb.com/title/tt10288566',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Better Days (Hong Kong)',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMTlmNGY5OWQtZDU3OS00YTViLTk1M2QtZTc2ODBmY2Y2NTkzXkEyXkFqcGdeQXVyMTAyNzgyNjQ0.jpg',
            'movie': 'Better Days (Hong Kong)',
            'link': 'https://www.imdb.com/title/tt9586294',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Collective (Romania)',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNDc5MTA2ZjgtOWU4OC00YjU4LTk3ZGUtYmMwZjRhODJiYTdiXkEyXkFqcGdeQXVyMTA2MDU0NjM5.jpg',
            'movie': 'Collective (Romania)',
            'link': 'https://www.imdb.com/title/tt10706602',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The man who sold his skin (Tunisia)',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTNhMzFmMWItYjcxNy00Nzk2LWI0YzEtMzM4OTFhMjg0NThlXkEyXkFqcGdeQXVyODc0OTEyNDU@.jpg',
            'movie': 'The man who sold his skin (Tunisia)',
            'link': 'https://www.imdb.com/title/tt10360862',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Quo vadis, Aida? (Bosnia and Herzegovina)',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjMxMzAxMTUtNjY3Mi00MjZiLTgyYjMtNzAwZGI4YzViNGQxXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Quo vadis, Aida? (Bosnia and Herzegovina)',
            'link': 'https://www.imdb.com/title/tt8633462/',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        /** THIRTEEN CATEGORY**/
        {
            'name': 'Marese Langan, Laura Allen and Claudia Stolze',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOGRiODEzM2QtOTUyYi00MWRlLTg4MzMtZGI0YmUzNWUyMjQ0XkEyXkFqcGdeQXVyMDA4NzMyOA@@.jpg',
            'movie': 'Emma.',
            'link': 'https://www.imdb.com/title/tt9214832/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Eryn Krueger Mekash, Matthew Mungle and Patricia Dehaney',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGI4NzRkNDgtYzQyOS00YWVjLTllYzctNmQ5NzkzOGIxMDBhXkEyXkFqcGdeQXVyODE5NzE3OTE@.jpg',
            'movie': 'Hillbilly Elegy',
            'link': 'https://www.imdb.com/title/tt6772802/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sergio Lopez-Rivera, Mia Neal and Jamika Wilson',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTBlZGY1OTAtN2RjMC00ZThiLWFiZmUtN2VkOGMxNmMyYjQwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/title/tt10514222',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Gigi Williams, Kimberley Spiteri and Colleen LaBaff',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10360862',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mark Coulier, Dalia Colli and Francesco Pegoretti',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNzgxNWJiOWQtZDA5Mi00NjBkLWIxMzUtZTg3Yjk5NjYyMDZjXkEyXkFqcGdeQXVyMDA4NzMyOA@@.jpg',
            'movie': 'Pinocchio',
            'link': 'https://www.imdb.com/title/tt8333746/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        /** FOURTEENTH CATEGORY **/
        {
            'name': 'Terence Blanchard',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjE4ODEwNzktYjg5Yi00N2YxLWExMmEtMmQyZTBiYWI4MGQwXkEyXkFqcGdeQXVyMTEyMjM2NDc2.jpg',
            'movie': 'Da 5 Bloods',
            'link': 'https://www.imdb.com/name/nm0005966',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trent Reznor and Atticus Ross',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0722153/',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emile Mosseri',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNWEzOTNjNDgtZDhhYS00ODAxLWIzNGMtYjU3OGZhYmI3ZDU4XkEyXkFqcGdeQXVyMTAzNjk5MDI4.jpg',
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm7888676',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'James Newton Howard',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDNlNmVlNDItMjE3Yi00ZTA3LWIyOTktNDhhMGFlZjk5ZDQ0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/name/nm0006133',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trent Reznor, Atticus Ross and Jon Batiste',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YzUtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@.jpg',
            'movie': 'Soul',
            'link': 'https://www.imdb.com/name/nm4456022',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        /** FIFTEEN CATEGORY**/
        {
            'name': 'Fight For You - H.E.R., Dernst Emile II and Tiara Thomas',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTYwNWNmM2UtNDhlOC00ZGQzLWI1MTMtMmZlMTFjM2Y1N2ZhXkEyXkFqcGdeQXVyMTY5Nzc4MDY@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.youtube.com/watch?v=exJq2NrAwdc',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Hear My Voice - Daniel Pemberton and Celeste',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYjYzOGE1MjUtODgyMy00ZDAxLTljYTgtNzk0Njg2YWQwMTZhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.youtube.com/watch?v=pnY9_DXMBis',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Husavik - Savan Kotecha, Fat Max Gsus and Rickard Göransson',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYzRjYzA5NTQtOTE3MC00OTYzLWEzODItMzQxYWE1NDJkMDA0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Eurovision Song Contest: The Story of Fire Saga',
            'link': 'https://www.youtube.com/watch?v=qjuphuG3ndw',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The lo Sì (Seen) - Laura Pausini and Diane Warren',
            'pic': 'https://m.media-amazon.com/images/M/MV5BODAxNzZmNTktMGI3Ny00MDM4LWI3MmYtNWUwZThhNWQxMWU4XkEyXkFqcGdeQXVyMTE5MTkxMDI2.jpg',
            'movie': 'Life Ahead',
            'link': 'https://www.youtube.com/watch?v=imjSm7FNmwE',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Speak Now - Leslie Odom Jr. and Sam Ashworth',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYmJlYWQ0NWMtMzU5Ni00MDNhLTk2YmUtYWYzZTJhMDMxMzE0XkEyXkFqcGdeQXVyODE0OTU5Nzg@.jpg',
            'movie': 'One Night in Miami…',
            'link': 'https://www.youtube.com/watch?v=1vAvQ9Um8hQ',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        /** SIXTEEN CATEGORY **/
        {
            'name': 'The Father',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGJhNWRiOWQtMjI4OS00ZjcxLTgwMTAtMzQ2ODkxY2JkOTVlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Judas and the Black Messiah',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTYwNWNmM2UtNDhlOC00ZGQzLWI1MTMtMmZlMTFjM2Y1N2ZhXkEyXkFqcGdeQXVyMTY5Nzc4MDY@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/title/tt9784798/',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mank',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Minari',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNWEzOTNjNDgtZDhhYS00ODAxLWIzNGMtYjU3OGZhYmI3ZDU4XkEyXkFqcGdeQXVyMTAzNjk5MDI4.jpg',
            'movie': 'Minari',
            'link': 'https://www.imdb.com/title/tt10633456',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nomadland',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDRiZWUxNmItNDU5Yy00ODNmLTk0M2ItZjQzZTA5OTJkZjkyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9620292',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Promising Young Woman',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZDViMzBiNGMtZTIyNS00NzI4LWE3NDMtNmM1NDk0NzBlMWRlXkEyXkFqcGdeQXVyMTA2MDU0NjM5.jpg',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/title/tt9770150',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sound of Metal',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjcyYjg0M2ItMzMyZS00NmM1LTlhZDMtN2MxN2RhNWY4YTkwXkEyXkFqcGdeQXVyNjY1MTg4Mzc@.jpg',
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/title/tt5363618',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Trial of the Chicago 7',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYjYzOGE1MjUtODgyMy00ZDAxLTljYTgtNzk0Njg2YWQwMTZhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        /** SEVENTEEN CATEGORY **/
        {
            'name': 'Peter Francis and Cathy Featherstone',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGJhNWRiOWQtMjI4OS00ZjcxLTgwMTAtMzQ2ODkxY2JkOTVlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mark Ricker, Karen O\'Hara and Diana Stoughton',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTBlZGY1OTAtN2RjMC00ZThiLWFiZmUtN2VkOGMxNmMyYjQwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/title/tt10514222',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Donald Graham Burt and Jan Pascale',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'David Crank and Elizabeth Keenan',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDNlNmVlNDItMjE3Yi00ZTA3LWIyOTktNDhhMGFlZjk5ZDQ0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nathan Crowley and Kathy Lucas',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA4NjE0NjEy.jpg',
            'movie': 'Tenet',
            'link': 'https://www.imdb.com/title/tt6723592',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        /** EIGHTEEN CATEGORY **/
        {
            'name': 'Burrow',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOGM3OTA4NWUtZGUwMy00NzYxLThiYjUtNTMyMjMwNmIzZTE0XkEyXkFqcGdeQXVyNzM0MDQ1Mw@@.jpg',
            'movie': 'Burrow',
            'link': 'https://www.imdb.com/title/tt13167288',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Genius Loci',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTEyOGM5ODYtNzU0Yy00MWM3LWI5YmYtYjc0NjUwMTQyYmJmXkEyXkFqcGdeQXVyNjE4OTU2MzY@.jpg',
            'movie': 'Genius Loci',
            'link': 'https://www.imdb.com/title/tt11884670/',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'If Anything Happens I Love You',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGI5OTU4MWQtMDE4ZS00ZWViLTk2OTItMmU5ZmRlNzg1N2Y5XkEyXkFqcGdeQXVyMzc3MTE2Mzg@.jpg',
            'movie': 'If Anything Happens I Love You',
            'link': 'https://www.imdb.com/title/tt11768948/',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Opera',
            'pic': '#',
            'movie': 'Opera',
            'link': 'https://www.imdb.com/title/tt9764724',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Yes-People',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjY2ZjE4YjMtODM1OC00MWJmLWFkN2EtZjJhMmQ1YTc5MjlmXkEyXkFqcGdeQXVyNjE4OTU2MzY@.jpg',
            'movie': 'Yes-People',
            'link': 'https://www.imdb.com/title/tt12706728/',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        /** NINETEEN CATEGORY **/
        {
            'name': 'Feeling through',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNGY2ZGZhYmQtYjc5My00NWI5LTk5YjgtOTAyYmNlMzU3ZWRjXkEyXkFqcGdeQXVyMjEyMTYwMjk@.jpg',
            'movie': 'Feeling through',
            'link': 'https://www.imdb.com/title/tt9280166',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Letter Room',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTBhNDFiNjItZDM3Ni00N2Y0LWE4NjMtMzBiNDc3MjA2ZmFiXkEyXkFqcGdeQXVyMTE2NzYxNDcz.jpg',
            'movie': 'The Letter Room',
            'link': 'https://www.imdb.com/title/tt11962160/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Present',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNTM2ZWQ3NzktNDY4MS00YzhmLWI0YTktYjUzNDljZDA0M2FmXkEyXkFqcGdeQXVyNjYxMDQwOTI@.jpg',
            'movie': 'The Present',
            'link': 'https://www.imdb.com/title/tt11474480/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Two Distant Strangers',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjBlZTVhYzItOTdjOS00YWY0LWE3NzQtZTc5MjRkY2RjMDM5XkEyXkFqcGdeQXVyNTU5NjE4OTY@.jpg',
            'movie': 'Two Distant Strangers',
            'link': 'https://www.imdb.com/title/tt13472984/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'White Eye',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNmU4Zjg3MGYtMTg2OS00MWE1LWFjYTEtYWRkMmJkZjFhODk1XkEyXkFqcGdeQXVyNzMzOTUyNTY@.jpg',
            'movie': 'White Eye',
            'link': 'https://www.imdb.com/title/tt10538710/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTIETH CATEGORY **/
        {
            'name': 'Warren Shaw, Michael Minkler, Beau Borders and David Wyman',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTFkZjYxNWItZmE2MC00MGE4LWIxYTgtZmIzOWM1YmI2YWEzXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Greyhound',
            'link': 'https://www.imdb.com/title/tt6048922',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ren Klyce, Jeremy Molod, David Parker, Nathan Nance and Drew Kunin',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZTllMjI0ZGYtM2FmZC00ZmY4LTlkNTYtZThlOWQ1OGQyZTA3XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286/',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Oliver Tarney, Mike Prestwood Smith, William Miller and John Pritchett',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDNlNmVlNDItMjE3Yi00ZTA3LWIyOTktNDhhMGFlZjk5ZDQ0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/name/nm0006133',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ren Klyce, Coya Elliott and David Parker',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YzUtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@.jpg',
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/tt2948372',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nicolas Becker, Jaime Baksht, Michelle Couttolenc, Carlos Cortés and Phillip Bladh',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjcyYjg0M2ItMzMyZS00NmM1LTlhZDMtN2MxN2RhNWY4YTkwXkEyXkFqcGdeQXVyNjY1MTg4Mzc@.jpg',
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm4456022',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-FIRST CATEGORY **/
        {
            'name': 'Matt Sloan, Genevieve Camilleri, Matt Everitt and Brian Cox',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYWVkMWEyMDUtZTVmOC00MTYxLWE1ZTUtNjk4M2IzMjY2OTIxXkEyXkFqcGdeQXVyMDk5Mzc5MQ@@.jpg',
            'movie': 'Love and Monsters',
            'link': 'https://www.imdb.com/title/tt2222042?ref_=nv_sr_srsg_0',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Matthew Kasmir, Christopher Lawrence, Max Solomon and David Watkins',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNDQwYjJjODMtOWNmNC00NDJjLThiNDgtNzVkOTM1MjY5NDQ5XkEyXkFqcGdeQXVyMTEyMjM2NDc2.jpg',
            'movie': 'The Midnight Sky',
            'link': 'https://www.imdb.com/name/nm10827638',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sean Faden, Anders Langlands, Seth Maury and Steve Ingram',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNDliY2E1MjUtNzZkOS00MzJlLTgyOGEtZDg4MTI1NzZkMTBhXkEyXkFqcGdeQXVyNjMwMzc3MjE@.jpg',
            'movie': 'Mulan',
            'link': 'https://www.imdb.com/title/tt4566758/',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nick Davis, Greg Fisher, Ben Jones and Santiago Colomo Martinez',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZWY3OTNhNWUtMDk2My00ZGVhLWE5ODQtM2NkOTZiMWM2MGY2XkEyXkFqcGdeQXVyNjMwMzc3MjE@.jpg',
            'movie': 'The One and Only Ivan',
            'link': 'https://www.imdb.com/title/tt3661394?ref_=nv_sr_srsg_2',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Andrew Jackson, David Lee, Andrew Lockley and Scott Fisher',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLTg5ZmYtYzM0MTE4NWE2NzlhXkEyXkFqcGdeQXVyMTA4NjE0NjEy.jpg',
            'movie': 'Tenet',
            'link': 'https://www.imdb.com/title/tt6723592?ref_=nv_sr_srsg_0',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-SECOND CATEGORY **/
        {
            'name': ' Sacha Baron Cohen, Anthony Hines and Dan Swimer',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNmY3OTdkOWEtNjc2ZC00OTZmLWI5OWItMjdjYjRkNTExNDNhXkEyXkFqcGdeQXVyMjkwOTAyMDU@.jpg',
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/name/nm0056187',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Christopher Hampton and Florian Zeller',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZGJhNWRiOWQtMjI4OS00ZjcxLTgwMTAtMzQ2ODkxY2JkOTVlXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0358960',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDRiZWUxNmItNDU5Yy00ODNmLTk0M2ItZjQzZTA5OTJkZjkyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@.jpg',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm2125482',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Kemp Powers',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYmJlYWQ0NWMtMzU5Ni00MDNhLTk2YmUtYWYzZTJhMDMxMzE0XkEyXkFqcGdeQXVyODE0OTU5Nzg@.jpg',
            'movie': 'One Night in Miami',
            'link': 'https://www.imdb.com/name/nm5358492',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ramin Bahrani',
            'pic': 'https://m.media-amazon.com/images/M/MV5BMDVkMDRkMzItN2EyYS00ZTI5LTljYzgtNzRmZDQ0OTQ3M2VjXkEyXkFqcGdeQXVyODk4OTc3MTY@.jpg',
            'movie': 'The White Tiger',
            'link': 'https://www.imdb.com/name/nm1023919',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-THIRD CATEGORY **/
        {
            'name': 'Will Berson & Shaka King',
            'pic': 'https://m.media-amazon.com/images/M/MV5BOTYwNWNmM2UtNDhlOC00ZGQzLWI1MTMtMmZlMTFjM2Y1N2ZhXkEyXkFqcGdeQXVyMTY5Nzc4MDY@.jpg',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm0077768',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lee Isaac Chung',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNWEzOTNjNDgtZDhhYS00ODAxLWIzNGMtYjU3OGZhYmI3ZDU4XkEyXkFqcGdeQXVyMTAzNjk5MDI4.jpg',
            'movie': 'Mimari',
            'link': 'https://www.imdb.com/name/nm1818032',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emerald Fennell',
            'pic': 'https://m.media-amazon.com/images/M/MV5BZDViMzBiNGMtZTIyNS00NzI4LWE3NDMtNmM1NDk0NzBlMWRlXkEyXkFqcGdeQXVyMTA2MDU0NjM5.jpg',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm2193504',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Darius Marder, Abraham Marder and Derek Cianfrance',
            'pic': 'https://m.media-amazon.com/images/M/MV5BNjcyYjg0M2ItMzMyZS00NmM1LTlhZDMtN2MxN2RhNWY4YTkwXkEyXkFqcGdeQXVyNjY1MTg4Mzc@.jpg',
            'movie': 'The Father',
            'link': 'https://m.media-amazon.com/images/M/MV5BYTllZDJlNjEtYmI2OC00NWRiLTg5YjMtYzU3OWI3ZTU1YmVhXkEyXkFqcGdeQXVyNTg0NTIyMjI@.jpg',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Aaron Sorkin',
            'pic': 'https://m.media-amazon.com/images/M/MV5BYjYzOGE1MjUtODgyMy00ZDAxLTljYTgtNzk0Njg2YWQwMTZhXkEyXkFqcGdeQXVyMDM2NDM2MQ@@.jpg',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/name/nm0815070',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        }
    ];

    //Create all the nominees referring to their belonged Category and AwardEvent
    promises = [];
    await nominees.forEach((nominee) => {
        promises.push((new Nominee(nominee)).save());
    })
    const NOMINEES = await Promise.all(promises);

    promises = [];
    await NOMINEES.forEach(nominee => {
        promises.push(Category.findByIdAndUpdate(nominee.category, {$push: {nominees: nominee}}, {new: true}));
    });
    await Promise.all(promises);
}
