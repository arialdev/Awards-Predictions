const path = require("path");

var colors = require('colors');
const config = require('./config.json');

var userRoutes = require('./api/routes/userRoutes');
var awardEventRoutes = require('./api/routes/awardRoutes');
var categoryRoutes = require('./api/routes/categoryRoutes');
var nomineeRoutes = require('./api/routes/nomineeRoutes');
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
nomineeRoutes(app);


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
            'pic': `${appRoot}/assets/data/nominees/people/Riz Ahmed.jpg`,
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm1981893',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chadwick Boseman',
            'pic': `${appRoot}/assets/data/nominees/people/Chadwick Boseman.jpg`,
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm1569276',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Anthony Hopkins',
            'pic': `${appRoot}/assets/data/nominees/people/Anthony Hopkins.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0000164',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Gary Oldman',
            'pic': `${appRoot}/assets/data/nominees/people/Gary Oldman.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0000198',
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Steven Yeun',
            'pic': `${appRoot}/assets/data/nominees/people/Steven Yeun.jpg`,
            'movie': 'Minari',
            'link': `${appRoot}/assets/data/nominees/people/Riz.jpg`,
            'category': OSCARS.categories[0]._id,
            'awardEvent': OSCARS._id,
        },
        /** SECOND CATEGORY **/
        {
            'name': 'Sacha Baron Cohen',
            'pic': `${appRoot}/assets/data/nominees/people/Sacha Baron Cohen.jpg`,
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/name/nm0056187',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Daniel Kaluuya',
            'pic': `${appRoot}/assets/data/nominees/people/Daniel Kaluuya.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm2257207',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Leslie Odom Jr.',
            'pic': `${appRoot}/assets/data/nominees/people/Leslie Odom Jr..jpg`,
            'movie': 'One Night in Miami...',
            'link': 'https://www.imdb.com/name/nm0705152',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Paul Raci',
            'pic': `${appRoot}/assets/data/nominees/people/Paul Raci.jpg`,
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm0001467',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lakeith Stanfield',
            'pic': `${appRoot}/assets/data/nominees/people/Lakeith Stanfield.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm3147751/',
            'category': OSCARS.categories[1]._id,
            'awardEvent': OSCARS._id,
        },
        /** THIRD CATEGORY **/
        {
            'name': 'Viola Davis',
            'pic': `${appRoot}/assets/data/nominees/people/Viola Davis.jpg`,
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm0205626',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Andra Day',
            'pic': `${appRoot}/assets/data/nominees/people/Andra Day.jpeg`,
            'movie': 'The United States vs. Billie Holiday',
            'link': 'https://www.imdb.com/name/nm7363531',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Vanessa Kirby',
            'pic': `${appRoot}/assets/data/nominees/people/Vanessa Kirby.jpg`,
            'movie': 'Pieces of a Woman',
            'link': 'https://www.imdb.com/name/nm3948952',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Frances McDormand',
            'pic': `${appRoot}/assets/data/nominees/people/Frances McDormand.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm0000531',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Carey Mulligan',
            'pic': `${appRoot}/assets/data/nominees/people/Carey Mulligan.jpg`,
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm1659547',
            'category': OSCARS.categories[2]._id,
            'awardEvent': OSCARS._id,
        },
        /** FOURTH CATEGORY **/
        {
            'name': 'Maria Bakalova',
            'pic': `${appRoot}/assets/data/nominees/people/Maria Bakalova.jpg`,
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/name/nm7210025',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Glenn Close',
            'pic': `${appRoot}/assets/data/nominees/people/Glenn Close.jpg`,
            'movie': 'Hillbilly Elegy',
            'link': 'https://www.imdb.com/name/nm0000335',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Olivia Colman',
            'pic': `${appRoot}/assets/data/nominees/people/Olivia Colman.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm1469236',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Amanda Seyfried',
            'pic': `${appRoot}/assets/data/nominees/people/Amanda Seyfried.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm1086543',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Youn Yuh-jung',
            'pic': `${appRoot}/assets/data/nominees/people/Youn Yuh-jung.jpg`,
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm0950926',
            'category': OSCARS.categories[3]._id,
            'awardEvent': OSCARS._id,
        },
        /** FIFTH CATEGORY **/
        {
            'name': 'Onward',
            'pic': `${appRoot}/assets/data/nominees/movies/Onward.jpg`,
            'movie': 'Onward',
            'link': 'https://www.imdb.com/title/tt7146812',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Over the Moon',
            'pic': `${appRoot}/assets/data/nominees/movies/Over the Moon.jpg`,
            'movie': 'Over the Moon',
            'link': 'https://www.imdb.com/title/tt7488208',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A Shaun the Sheep Movie: Farmageddon',
            'pic': `${appRoot}/assets/data/nominees/movies/A Shaun the Sheep Movie - Farmageddon.jpg`,
            'movie': 'A Shaun the Sheep Movie: Farmageddon',
            'link': 'https://www.imdb.com/title/tt6193408',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Soul',
            'pic': `${appRoot}/assets/data/nominees/movies/Soul.jpg`,
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/tt2948372',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Wolfwalkers',
            'pic': `${appRoot}/assets/data/nominees/movies/Wolfwalkers.jpg`,
            'movie': 'Wolfwalkers',
            'link': 'https://www.imdb.com/title/tt5198068',
            'category': OSCARS.categories[4]._id,
            'awardEvent': OSCARS._id,
        },
        /** SIXTH CATEGORY **/
        {
            'name': 'Sean Bobbitt',
            'pic': `${appRoot}/assets/data/nominees/movies/Judas and the Black Messiah.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Erik Messerschmidt',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Dariusz Wolski',
            'pic': `${appRoot}/assets/data/nominees/movies/News of the World.jpg`,
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/tt6878306',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Joshua James Richards',
            'pic': `${appRoot}/assets/data/nominees/movies/Nomadland.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9620292',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Phedon Papamichael',
            'pic': `${appRoot}/assets/data/nominees/movies/The Trial of the Chicago 7.jpg`,
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': OSCARS.categories[5]._id,
            'awardEvent': OSCARS._id,
        },
        /** SEVENTH CATEGORY **/
        {
            'name': 'Alexandra Byrne',
            'pic': `${appRoot}/assets/data/nominees/movies/Emma..jpg`,
            'movie': 'Emma.',
            'link': 'https://www.imdb.com/name/nm0126107',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ann Roth',
            'pic': `${appRoot}/assets/data/nominees/movies/Ma Rainey\'s Black Bottom.jpg`,
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm0744778/',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trish Summerville',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Bina Daigeler',
            'pic': `${appRoot}/assets/data/nominees/movies/Mulan.jpg`,
            'movie': 'Mulan',
            'link': 'https://www.imdb.com/name/nm0197257',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Massimo Cantini Parrini',
            'pic': `${appRoot}/assets/data/nominees/movies/Pinocchio.jpg`,
            'movie': 'Pinocchio',
            'link': 'https://www.imdb.com/name/nm1964768',
            'category': OSCARS.categories[6]._id,
            'awardEvent': OSCARS._id,
        },
        /** EIGHTH CATEGORY **/
        {
            'name': 'Thomas Vinterberg',
            'pic': `${appRoot}/assets/data/nominees/people/Thomas Vinterberg.jpg`,
            'movie': 'Another Round',
            'link': 'https://www.imdb.com/name/nm0899121',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'David Fincher',
            'pic': `${appRoot}/assets/data/nominees/people/David Fincher.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0000399',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lee Isaac Chung',
            'pic': `${appRoot}/assets/data/nominees/people/Lee Isaac Chung.jpg`,
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm1818032',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': `${appRoot}/assets/data/nominees/people/Chloé Zhao.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm2125482',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emerald Fennell',
            'pic': `${appRoot}/assets/data/nominees/people/Emerald Fennell.jpg`,
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm2193504',
            'category': OSCARS.categories[7]._id,
            'awardEvent': OSCARS._id,
        },
        /** NINTH CATEGORY **/
        {
            'name': 'Collective',
            'pic': `${appRoot}/assets/data/nominees/movies/Collective.jpg`,
            'movie': 'Collective',
            'link': 'https://www.imdb.com/title/tt10706602',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Crip camp',
            'pic': `${appRoot}/assets/data/nominees/movies/Crip camp.jpg`,
            'movie': 'Crip camp',
            'link': 'https://www.imdb.com/title/tt8923484',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Mole Agent',
            'pic': `${appRoot}/assets/data/nominees/movies/The Mole Agent.jpg`,
            'movie': 'The mole Agent',
            'link': 'https://www.imdb.com/title/tt11394298',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'My octopus teacher',
            'pic': `${appRoot}/assets/data/nominees/movies/My Octopus teacher.jpg`,
            'movie': 'My octopus teacher',
            'link': 'https://www.imdb.com/title/tt12888462',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'TIME',
            'pic': `${appRoot}/assets/data/nominees/movies/Time.jpg`,
            'movie': 'TIME',
            'link': 'https://www.imdb.com/title/tt11416746',
            'category': OSCARS.categories[8]._id,
            'awardEvent': OSCARS._id,
        },
        /** TENTH CATEGORY **/
        {
            'name': 'Colette',
            'pic': `${appRoot}/assets/data/nominees/movies/Colette.jpg`,
            'movie': 'Colette',
            'link': 'https://www.imdb.com/title/tt5437928',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A Concerto Is A Conversation',
            'pic': `${appRoot}/assets/data/nominees/movies/A Concerto Is A Conversation.jpg`,
            'movie': 'A Concerto Is A Conversation',
            'link': 'https://www.imdb.com/title/tt13793326l',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Do not split',
            'pic': `${appRoot}/assets/data/nominees/movies/Do Not Split.jpg`,
            'movie': 'Do not split',
            'link': 'https://www.imdb.com/title/tt11512676',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Hunger Ward',
            'pic': `${appRoot}/assets/data/nominees/movies/Hunger Ward.jpg`,
            'movie': 'Hunger ward',
            'link': 'https://www.imdb.com/title/tt12979636',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'A Love Song for Latasha',
            'pic': `${appRoot}/assets/data/nominees/movies/A Love Song for Latasha.jpg`,
            'movie': 'A Love Song for Latasha',
            'link': 'https://www.imdb.com/title/tt8993180',
            'category': OSCARS.categories[9]._id,
            'awardEvent': OSCARS._id,
        },
        /** ELEVENTH CATEGORY **/
        {
            'name': 'Yorgos Lamprinos',
            'pic': `${appRoot}/assets/data/nominees/movies/The Father.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0487166',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': `${appRoot}/assets/data/nominees/movies/Nomadland.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9770150',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Frédéric Thoraval',
            'pic': `${appRoot}/assets/data/nominees/movies/Promising Young Woman.jpg`,
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm1754850',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mikkel E. G. Nielsen',
            'pic': `${appRoot}/assets/data/nominees/movies/Sound of Metal.jpg`,
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm1182055',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Alan Baumgarten',
            'pic': `${appRoot}/assets/data/nominees/movies/The Trial of the Chicago 7.jpg`,
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt8993180',
            'category': OSCARS.categories[10]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWELFTH CATEGORY**/
        {
            'name': 'Another Round (Denmark)',
            'pic': `${appRoot}/assets/data/nominees/movies/Another Round.jpg`,
            'movie': 'Another Round (Denmark)',
            'link': 'https://www.imdb.com/title/tt10288566',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Better Days (Hong Kong)',
            'pic': `${appRoot}/assets/data/nominees/movies/Better Days.jpg`,
            'movie': 'Better Days (Hong Kong)',
            'link': 'https://www.imdb.com/title/tt9586294',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Collective (Romania)',
            'pic': `${appRoot}/assets/data/nominees/movies/Collective.jpg`,
            'movie': 'Collective (Romania)',
            'link': 'https://www.imdb.com/title/tt10706602',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Man Who Sold His Skin (Tunisia)',
            'pic': `${appRoot}/assets/data/nominees/movies/The Man Who Sold His Skin.jpg`,
            'movie': 'The Man Who Sold His Skin (Tunisia)',
            'link': 'https://www.imdb.com/title/tt10360862',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Quo Vadis, Aida? (Bosnia and Herzegovina)',
            'pic': `${appRoot}/assets/data/nominees/movies/Quo Vadis, Aida.jpg`,
            'movie': 'Quo Vadis, Aida? (Bosnia and Herzegovina)',
            'link': 'https://www.imdb.com/title/tt8633462/',
            'category': OSCARS.categories[11]._id,
            'awardEvent': OSCARS._id,
        },
        /** THIRTEEN CATEGORY**/
        {
            'name': 'Marese Langan, Laura Allen and Claudia Stolze',
            'pic': `${appRoot}/assets/data/nominees/movies/Emma..jpg`,
            'movie': 'Emma.',
            'link': 'https://www.imdb.com/title/tt9214832/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Eryn Krueger Mekash, Matthew Mungle and Patricia Dehaney',
            'pic': `${appRoot}/assets/data/nominees/movies/Hillbilly Elegy.jpg`,
            'movie': 'Hillbilly Elegy',
            'link': 'https://www.imdb.com/title/tt6772802/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sergio Lopez-Rivera, Mia Neal and Jamika Wilson',
            'pic': `${appRoot}/assets/data/nominees/movies/Ma Rainey\'s Black Bottom.jpg`,
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/title/tt10514222',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Gigi Williams, Kimberley Spiteri and Colleen LaBaff',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10360862',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mark Coulier, Dalia Colli and Francesco Pegoretti',
            'pic': `${appRoot}/assets/data/nominees/movies/Pinocchio.jpg`,
            'movie': 'Pinocchio',
            'link': 'https://www.imdb.com/title/tt8333746/',
            'category': OSCARS.categories[12]._id,
            'awardEvent': OSCARS._id,
        },
        /** FOURTEENTH CATEGORY **/
        {
            'name': 'Terence Blanchard',
            'pic': `${appRoot}/assets/data/nominees/movies/Da 5 Bloods.jpg`,
            'movie': 'Da 5 Bloods',
            'link': 'https://www.imdb.com/name/nm0005966',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trent Reznor and Atticus Ross',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0722153/',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emile Mosseri',
            'pic': `${appRoot}/assets/data/nominees/movies/Minari.jpg`,
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm7888676',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'James Newton Howard',
            'pic': `${appRoot}/assets/data/nominees/movies/News of the World.jpg`,
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/name/nm0006133',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Trent Reznor, Atticus Ross and Jon Batiste',
            'pic': `${appRoot}/assets/data/nominees/movies/Soul.jpg`,
            'movie': 'Soul',
            'link': 'https://www.imdb.com/name/nm4456022',
            'category': OSCARS.categories[13]._id,
            'awardEvent': OSCARS._id,
        },
        /** FIFTEEN CATEGORY**/
        {
            'name': 'Fight For You - H.E.R., Dernst Emile II and Tiara Thomas',
            'pic': `${appRoot}/assets/data/nominees/movies/Judas and the Black Messiah.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.youtube.com/watch?v=exJq2NrAwdc',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Hear My Voice - Daniel Pemberton and Celeste',
            'pic': `${appRoot}/assets/data/nominees/movies/The Trial of the Chicago 7.jpg`,
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.youtube.com/watch?v=pnY9_DXMBis',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Husavik - Savan Kotecha, Fat Max Gsus and Rickard Göransson',
            'pic': `${appRoot}/assets/data/nominees/movies/Eurovision Song Contest.jpg`,
            'movie': 'Eurovision Song Contest: The Story of Fire Saga',
            'link': 'https://www.youtube.com/watch?v=qjuphuG3ndw',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The lo Sì (Seen) - Laura Pausini and Diane Warren',
            'pic': `${appRoot}/assets/data/nominees/movies/Life Ahead.jpg`,
            'movie': 'Life Ahead',
            'link': 'https://www.youtube.com/watch?v=imjSm7FNmwE',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Speak Now - Leslie Odom Jr. and Sam Ashworth',
            'pic': `${appRoot}/assets/data/nominees/movies/One Night in Miami....jpg`,
            'movie': 'One Night in Miami…',
            'link': 'https://www.youtube.com/watch?v=1vAvQ9Um8hQ',
            'category': OSCARS.categories[14]._id,
            'awardEvent': OSCARS._id,
        },
        /** SIXTEEN CATEGORY **/
        {
            'name': 'The Father',
            'pic': `${appRoot}/assets/data/nominees/movies/The Father.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Judas and the Black Messiah',
            'pic': `${appRoot}/assets/data/nominees/movies/Judas and the Black Messiah.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/title/tt9784798/',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mank',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Minari',
            'pic': `${appRoot}/assets/data/nominees/movies/Minari.jpg`,
            'movie': 'Minari',
            'link': 'https://www.imdb.com/title/tt10633456',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nomadland',
            'pic': `${appRoot}/assets/data/nominees/movies/Nomadland.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9620292',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Promising Young Woman',
            'pic': `${appRoot}/assets/data/nominees/movies/Promising Young Woman.jpg`,
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/title/tt9770150',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sound of Metal',
            'pic': `${appRoot}/assets/data/nominees/movies/Sound of Metal.jpg`,
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/title/tt5363618',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Trial of the Chicago 7',
            'pic': `${appRoot}/assets/data/nominees/movies/The Trial of the Chicago 7.jpg`,
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': OSCARS.categories[15]._id,
            'awardEvent': OSCARS._id,
        },
        /** SEVENTEEN CATEGORY **/
        {
            'name': 'Peter Francis and Cathy Featherstone',
            'pic': `${appRoot}/assets/data/nominees/movies/The Father.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Mark Ricker, Karen O\'Hara and Diana Stoughton',
            'pic': `${appRoot}/assets/data/nominees/movies/Ma Rainey\'s Black Bottom.jpg`,
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/title/tt10514222',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Donald Graham Burt and Jan Pascale',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'David Crank and Elizabeth Keenan',
            'pic': `${appRoot}/assets/data/nominees/movies/News of the World.jpg`,
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nathan Crowley and Kathy Lucas',
            'pic': `${appRoot}/assets/data/nominees/movies/Tenet.jpg`,
            'movie': 'Tenet',
            'link': 'https://www.imdb.com/title/tt6723592',
            'category': OSCARS.categories[16]._id,
            'awardEvent': OSCARS._id,
        },
        /** EIGHTEEN CATEGORY **/
        {
            'name': 'Burrow',
            'pic': `${appRoot}/assets/data/nominees/movies/Burrow.jpg`,
            'movie': 'Burrow',
            'link': 'https://www.imdb.com/title/tt13167288',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Genius Loci',
            'pic': `${appRoot}/assets/data/nominees/movies/Genius Loci.jpg`,
            'movie': 'Genius Loci',
            'link': 'https://www.imdb.com/title/tt11884670/',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'If Anything Happens I Love You',
            'pic': `${appRoot}/assets/data/nominees/movies/If Anything Happens I Love You.jpg`,
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
            'pic': `${appRoot}/assets/data/nominees/movies/Yes-People.jpg`,
            'movie': 'Yes-People',
            'link': 'https://www.imdb.com/title/tt12706728/',
            'category': OSCARS.categories[17]._id,
            'awardEvent': OSCARS._id,
        },
        /** NINETEEN CATEGORY **/
        {
            'name': 'Feeling Through',
            'pic': `${appRoot}/assets/data/nominees/movies/Feeling Through.jpg`,
            'movie': 'Feeling Through',
            'link': 'https://www.imdb.com/title/tt9280166',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Letter Room',
            'pic': `${appRoot}/assets/data/nominees/movies/The Letter Room.jpg`,
            'movie': 'The Letter Room',
            'link': 'https://www.imdb.com/title/tt11962160/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'The Present',
            'pic': `${appRoot}/assets/data/nominees/movies/The Present.jpg`,
            'movie': 'The Present',
            'link': 'https://www.imdb.com/title/tt11474480/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Two Distant Strangers',
            'pic': `${appRoot}/assets/data/nominees/movies/Two Distant Strangers.jpg`,
            'movie': 'Two Distant Strangers',
            'link': 'https://www.imdb.com/title/tt13472984/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'White Eye',
            'pic': `${appRoot}/assets/data/nominees/movies/White Eye.jpg`,
            'movie': 'White Eye',
            'link': 'https://www.imdb.com/title/tt10538710/',
            'category': OSCARS.categories[18]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTIETH CATEGORY **/
        {
            'name': 'Warren Shaw, Michael Minkler, Beau Borders and David Wyman',
            'pic': `${appRoot}/assets/data/nominees/movies/Greyhound.jpg`,
            'movie': 'Greyhound',
            'link': 'https://www.imdb.com/title/tt6048922',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ren Klyce, Jeremy Molod, David Parker, Nathan Nance and Drew Kunin',
            'pic': `${appRoot}/assets/data/nominees/movies/Mank.jpg`,
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286/',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Oliver Tarney, Mike Prestwood Smith, William Miller and John Pritchett',
            'pic': `${appRoot}/assets/data/nominees/movies/News of the World.jpg`,
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/name/nm0006133',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ren Klyce, Coya Elliott and David Parker',
            'pic': `${appRoot}/assets/data/nominees/movies/Soul.jpg`,
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/tt2948372',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nicolas Becker, Jaime Baksht, Michelle Couttolenc, Carlos Cortés and Phillip Bladh',
            'pic': `${appRoot}/assets/data/nominees/movies/Sound of Metal.jpg`,
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm4456022',
            'category': OSCARS.categories[19]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-FIRST CATEGORY **/
        {
            'name': 'Matt Sloan, Genevieve Camilleri, Matt Everitt and Brian Cox',
            'pic': `${appRoot}/assets/data/nominees/movies/Love and Monsters.jpg`,
            'movie': 'Love and Monsters',
            'link': 'https://www.imdb.com/title/tt2222042?ref_=nv_sr_srsg_0',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Matthew Kasmir, Christopher Lawrence, Max Solomon and David Watkins',
            'pic': `${appRoot}/assets/data/nominees/movies/The Midnight Sky.jpg`,
            'movie': 'The Midnight Sky',
            'link': 'https://www.imdb.com/name/nm10827638',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Sean Faden, Anders Langlands, Seth Maury and Steve Ingram',
            'pic': `${appRoot}/assets/data/nominees/movies/Mulan.jpg`,
            'movie': 'Mulan',
            'link': 'https://www.imdb.com/title/tt4566758/',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Nick Davis, Greg Fisher, Ben Jones and Santiago Colomo Martinez',
            'pic': `${appRoot}/assets/data/nominees/movies/The One and Only Ivan.jpg`,
            'movie': 'The One and Only Ivan',
            'link': 'https://www.imdb.com/title/tt3661394?ref_=nv_sr_srsg_2',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Andrew Jackson, David Lee, Andrew Lockley and Scott Fisher',
            'pic': `${appRoot}/assets/data/nominees/movies/Tenet.jpg`,
            'movie': 'Tenet',
            'link': 'https://www.imdb.com/title/tt6723592?ref_=nv_sr_srsg_0',
            'category': OSCARS.categories[20]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-SECOND CATEGORY **/
        {
            'name': ' Sacha Baron Cohen, Anthony Hines and Dan Swimer',
            'pic': `${appRoot}/assets/data/nominees/movies/Borat Subsequent Moviefilm.jpg`,
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/name/nm0056187',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Christopher Hampton and Florian Zeller',
            'pic': `${appRoot}/assets/data/nominees/movies/The Father.jpg`,
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0358960',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': `${appRoot}/assets/data/nominees/movies/Nomadland.jpg`,
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm2125482',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Kemp Powers',
            'pic': `${appRoot}/assets/data/nominees/movies/One Night in Miami....jpg`,
            'movie': 'One Night in Miami...',
            'link': 'https://www.imdb.com/name/nm5358492',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Ramin Bahrani',
            'pic': `${appRoot}/assets/data/nominees/movies/The White Tiger.jpg`,
            'movie': 'The White Tiger',
            'link': 'https://www.imdb.com/name/nm1023919',
            'category': OSCARS.categories[21]._id,
            'awardEvent': OSCARS._id,
        },
        /** TWENTY-THIRD CATEGORY **/
        {
            'name': 'Will Berson & Shaka King',
            'pic': `${appRoot}/assets/data/nominees/movies/Judas and the Black Messiah.jpg`,
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/name/nm0077768',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Lee Isaac Chung',
            'pic': `${appRoot}/assets/data/nominees/movies/Minari.jpg`,
            'movie': 'Minari',
            'link': 'https://www.imdb.com/name/nm1818032',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Emerald Fennell',
            'pic': `${appRoot}/assets/data/nominees/movies/Promising Young Woman.jpg`,
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm2193504',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Darius Marder, Abraham Marder and Derek Cianfrance',
            'pic': `${appRoot}/assets/data/nominees/movies/The Father.jpg`,
            'movie': 'The Father',
            'link': 'https://m.media-amazon.com/images/M/MV5BYTllZDJlNjEtYmI2OC00NWRiLTg5YjMtYzU3OWI3ZTU1YmVhXkEyXkFqcGdeQXVyNTg0NTIyMjI@.jpg',
            'category': OSCARS.categories[22]._id,
            'awardEvent': OSCARS._id,
        },
        {
            'name': 'Aaron Sorkin',
            'pic': `${appRoot}/assets/data/nominees/movies/The Trial of the Chicago 7.jpg`,
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
