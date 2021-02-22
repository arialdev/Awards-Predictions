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
    console.log(`Resetting database: ${config.DBSchema}`);
    await mongoose.connection.db.dropDatabase();
    console.log(`Database dropped: ${config.DBSchema}`);

    console.log(`initializing database: ${config.DBSchema}`);

    // Initializing awards
    const awards = [{
        'name': "Golden Globes",
        'year': 2021,
        'edition': 78,
        'pic': 'https://www.goldenglobes.com/images/default_share_image.png',
    }];
    let promises = [];
    await awards.forEach((award) => {
        promises.push((new AwardEvent(award)).save());
    })
    let GOLDEN_GLOBES = (await Promise.all(promises))[0];

    // Initializing categories
    const categories = [
        {
            'name': "Best Picture Drama",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Picture - Musical/Comedy",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Actress - Motion Picture Drama",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Actor - Motion Picture Drama",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Actress - Motion Picture - Musical/Comedy",
            'awardEvent': GOLDEN_GLOBES._id
        },
        {
            'name': "Best Actor - Motion Picture – Musical/Comedy",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Supporting Actress - Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Supporting Actor - Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Director Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Screenplay Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Picture - Animated",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Picture - Foreign Language",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Score Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Song Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Drama Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Musical/Comedy Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Television Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Actress - Television Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Actor - Television Motion Picture",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Television Actress - Drama Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Television Actor - Drama Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Television Actress - Musical/Comedy Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Television Actor - Musical/Comedy Series",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Supporting Actress - Television",
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': "Best Supporting Actor - Television",
            'awardEvent': GOLDEN_GLOBES._id,
        }];

    //Create all the categories referring to their belonged AwardEvent
    promises = [];
    await categories.forEach((category) => {
        promises.push((new Category(category)).save());
    })


    //Update the previous AwardEvent so it can refers to their just created categories
    GOLDEN_GLOBES.categories = await Promise.all(promises);
    await GOLDEN_GLOBES.save();
    // let GG_CATEGORIES = await Promise.all(promises);
    // GOLDEN_GLOBES = await AwardEvent.findByIdAndUpdate(GOLDEN_GLOBES._id, {$set: {categories: GG_CATEGORIES}}, {new: true}); //other way to do it

    const nominees = [
        {
            /** FIRST CATEGORY **/
            'name': 'The Father',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Father%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/tt10272386',
            'category': GOLDEN_GLOBES.categories[0]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Mank',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Mank.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/tt10618286',
            'category': GOLDEN_GLOBES.categories[0]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Nomadland',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Nomadland.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/tt9620292',
            'category': GOLDEN_GLOBES.categories[0]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Promising Young Woman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Promising%20Young%20Woman%20.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/title/tt9770150',
            'category': GOLDEN_GLOBES.categories[0]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Trial of the Chicago 7',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Trial%20of%20the%20Chicago%207%2C%20The%20.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': GOLDEN_GLOBES.categories[0]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },  /** SECOND CATEGORY **/
        {
            'name': 'Borat Subsequent Moviefilm',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Borat%20Subsequent%20Moviefilm.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/title/tt13143964',
            'category': GOLDEN_GLOBES.categories[1]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Hamilton',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Hamilton.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Hamilton',
            'link': 'https://www.imdb.com/title/tt8503618',
            'category': GOLDEN_GLOBES.categories[1]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Music',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/music-2021.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Music',
            'link': 'https://www.imdb.com/title/tt7541720',
            'category': GOLDEN_GLOBES.categories[1]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Palm Springs',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Palm%20Springs.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Palm Springs',
            'link': 'https://www.imdb.com/title/tt9484998',
            'category': GOLDEN_GLOBES.categories[1]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Prom',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Prom%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Prom',
            'link': 'https://www.imdb.com/title/tt10161886',
            'category': GOLDEN_GLOBES.categories[1]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        }, /** THIRD CATEGORY **/
        {
            'name': 'Viola Davis',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/viola_davis_120116_fences.jpeg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm0205626',
            'category': GOLDEN_GLOBES.categories[2]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Andra Day',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Andra%20Day-GettyImages-1209353272.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The United States vs. Billie Holiday',
            'link': 'https://www.imdb.com/name/nm7363531',
            'category': GOLDEN_GLOBES.categories[2]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Vanessa Kirby',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Vanessa%20Kirby-GettyImages-1272137480.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Pieces of a Woman',
            'link': 'https://www.imdb.com/name/nm3948952',
            'category': GOLDEN_GLOBES.categories[2]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Frances McDormand',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/gg_frances_mcdormand_.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/name/nm0000531',
            'category': GOLDEN_GLOBES.categories[2]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Carey Mulligan',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/carey_mulligan_c_hfpa_13.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/name/nm1659547',
            'category': GOLDEN_GLOBES.categories[2]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },  /** FOURTH CATEGORY **/
        {
            'name': 'Riz Ahmed',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/riz_ahmed-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Sound of Metal',
            'link': 'https://www.imdb.com/name/nm1981893',
            'category': GOLDEN_GLOBES.categories[3]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Chadwick Boseman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Chadwick%20Boseman-GettyImages-1188765597.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ma Rainey\'s Black Bottom',
            'link': 'https://www.imdb.com/name/nm1569276',
            'category': GOLDEN_GLOBES.categories[3]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Anthony Hopkins',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/hopkins-073014-.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/name/nm0000164',
            'category': GOLDEN_GLOBES.categories[3]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Gary Oldman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/actress_actors-2/Gary-Oldman-111017-Darkest-Hour-2.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/name/nm0000198',
            'category': GOLDEN_GLOBES.categories[3]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },

        {
            'name': 'Tahar Rahim',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/tahar-rahim.jpeg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Mauritanian',
            'link': 'https://www.imdb.com/name/nm2588665',
            'category': GOLDEN_GLOBES.categories[3]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },  /** FIFTH CATEGORY **/
        {
            'name': 'Maria Bakalova',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Maria%20Bakalova%20%28c%29%20Felicity%20Kay.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/name/nm7210025',
            'category': GOLDEN_GLOBES.categories[4]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Kate Hudson',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/kate_hudson_091316_deepwater_horizon_2.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Music',
            'link': 'https://www.imdb.com/title/nm0005028',
            'category': GOLDEN_GLOBES.categories[4]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Michelle Pfeiffer',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/michelle_pfeiffer-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'French Exit',
            'link': 'https://www.imdb.com/title/nm0000201',
            'category': GOLDEN_GLOBES.categories[4]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Rosamund Pike',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/gg_rosamund_pike.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'I Care A Lot',
            'link': 'https://www.imdb.com/title/nm0683253',
            'category': GOLDEN_GLOBES.categories[4]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Anya Taylor-Joy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Anya_Taylor-Joy2020-02-19_15_pp-%20Magnus%20Sundholm.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Emma.',
            'link': 'https://www.imdb.com/title/nm5896355',
            'category': GOLDEN_GLOBES.categories[4]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },  /** SIXTH CATEGORY **/
        {
            'name': 'Sacha Baron Cohen',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/sacha_baron_cohen.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Borat Subsequent Moviefilm',
            'link': 'https://www.imdb.com/title/nm0056187',
            'category': GOLDEN_GLOBES.categories[5]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'James Corden',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/James%20Corden%20112519%20Cats%202C.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Prom',
            'link': 'https://www.imdb.com/title/nm0179479',
            'category': GOLDEN_GLOBES.categories[5]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Lin-Manuel Miranda',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/gg_lin_manuel_miranda.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Hamilton',
            'link': 'https://www.imdb.com/title/nm0592135',
            'category': GOLDEN_GLOBES.categories[5]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Dev Patel',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/dev_patel_82.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Personal History of David Copperfield',
            'link': 'https://www.imdb.com/title/nm2353862',
            'category': GOLDEN_GLOBES.categories[5]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Andy Samberg',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/andy_samberg.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Palm Springs',
            'link': 'https://www.imdb.com/title/nm1676221',
            'category': GOLDEN_GLOBES.categories[5]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** SEVENTH CATEGORY**/
            'name': 'Glenn Close',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/glenn_close_2.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Hillbilly Elegy',
            'link': 'https://www.imdb.com/title/nm0000335',
            'category': GOLDEN_GLOBES.categories[6]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Olivia Colman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/olivia_colman-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/nm1469236',
            'category': GOLDEN_GLOBES.categories[6]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jodie Foster',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/gallery_images/12-fosterjodie265_yk_ss.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Mauritanian',
            'link': 'https://www.imdb.com/title/nm0000149',
            'category': GOLDEN_GLOBES.categories[6]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Amanda Seyfried',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Amanda_Seyfried_102-Armando%20Gallo.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/nm1086543',
            'category': GOLDEN_GLOBES.categories[6]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Helena Zengel',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/helena-zengel.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/nm8023748',
            'category': GOLDEN_GLOBES.categories[6]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** EIGHT CATEGORY**/
            'name': 'Sacha Baron Cohen',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/sacha_baron_cohen.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/nm0056187',
            'category': GOLDEN_GLOBES.categories[7]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Daniel Kaluuya',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/daniel_kaluuya-gettyimages-889670112.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.imdb.com/title/nm2257207',
            'category': GOLDEN_GLOBES.categories[7]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jared Leto',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/gallery_images/jared-leto.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Little Things',
            'link': 'https://www.imdb.com/title/nm0001467',
            'category': GOLDEN_GLOBES.categories[7]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Bill Murray',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/bill_murray_c_hfpa_2012.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'On The Rocks',
            'link': 'https://www.imdb.com/title/nm0000195',
            'category': GOLDEN_GLOBES.categories[7]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Leslie Odom Jr.',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Leslie%20Odom%2C%20Jr.-GettyImages-1208062761.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'One Night in Miami...',
            'link': 'https://www.imdb.com/title/nm1502434',
            'category': GOLDEN_GLOBES.categories[7]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** NINTH CATEGORY **/
            'name': 'Emerald Fennell',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Emerald%20Fennell-GettyImages-1201904625.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/title/nm2193504',
            'category': GOLDEN_GLOBES.categories[8]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'David Fincher',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/david_fincher.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/nm0000399',
            'category': GOLDEN_GLOBES.categories[8]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Regina King',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/regina_king_0.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'One Night in Miami…',
            'link': 'https://www.imdb.com/title/nm0005093',
            'category': GOLDEN_GLOBES.categories[8]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Aaron Sorkin',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/aaron_sorkin_110717_mollys_game_2.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/nm0815070',
            'category': GOLDEN_GLOBES.categories[8]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Chloe%20Zhao-GettyImages-1131525859.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/nm2125482',
            'category': GOLDEN_GLOBES.categories[8]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TENTH CATEGORY **/
            'name': 'Emerald Fennell',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Emerald%20Fennell-GettyImages-1201904625.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Promising Young Woman',
            'link': 'https://www.imdb.com/title/nm2193504',
            'category': GOLDEN_GLOBES.categories[9]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jack Fincher',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/jack-fincher.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/nm10827638',
            'category': GOLDEN_GLOBES.categories[9]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Aaron Sorkin',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/aaron_sorkin_110717_mollys_game_2.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.imdb.com/title/nm0815070',
            'category': GOLDEN_GLOBES.categories[9]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Christopher Hampton, Florian Zeller',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/florian-zeller-christopher-hampton.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Father',
            'link': 'https://www.imdb.com/title/nm0358960',
            'category': GOLDEN_GLOBES.categories[9]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Chloé Zhao',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Chloe%20Zhao-GettyImages-1131525859.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Nomadland',
            'link': 'https://www.imdb.com/title/nm2125482',
            'category': GOLDEN_GLOBES.categories[9]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** ELEVENTH CATEGORY**/
            'name': 'The Croods: A New Age',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Croods-A%20New%20Age%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Croods: A New Age',
            'link': 'https://www.imdb.com/title/tt2850386',
            'category': GOLDEN_GLOBES.categories[10]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Onward',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Onward.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Onward',
            'link': 'https://www.imdb.com/title/tt7146812',
            'category': GOLDEN_GLOBES.categories[10]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Over the Moon',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Over%20the%20Moon.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Over the Moon',
            'link': 'https://www.imdb.com/title/tt7488208',
            'category': GOLDEN_GLOBES.categories[10]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Soul',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Soul.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/tt2948372',
            'category': GOLDEN_GLOBES.categories[10]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Wolfwalkers',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Wolfwalkers.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Wolfwalkers',
            'link': 'https://www.imdb.com/title/tt5198068',
            'category': GOLDEN_GLOBES.categories[10]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWELFTH CATEGORY**/
            'name': 'Another Round (Denmark)',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/another-round.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Another Round (Denmark)',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': GOLDEN_GLOBES.categories[11]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'La Llorona (France, Guatemala)',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/sh_la_llorona_festival_poster_1800x2400_laurels-1-1.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'La Llorona (France, Guatemala)',
            'link': 'https://www.imdb.com/title/tt10767168',
            'category': GOLDEN_GLOBES.categories[11]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Life Ahead (Italy)',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Life%20Ahead%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Life Ahead (Italy)',
            'link': 'https://www.imdb.com/title/tt10627584',
            'category': GOLDEN_GLOBES.categories[11]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Minari (USA)',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Minari.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Minari (USA)',
            'link': 'https://www.imdb.com/title/tt10633456',
            'category': GOLDEN_GLOBES.categories[11]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Two of Us (USA, France)',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/two-of-us.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Two of Us (USA, France)',
            'link': 'https://www.imdb.com/title/tt9845110',
            'category': GOLDEN_GLOBES.categories[11]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** THIRTEENTH CATEGORY**/
            'name': 'Alexandre Desplat',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Midnight%20Sky%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Midnight Sky',
            'link': 'https://www.imdb.com/title/nm0006035',
            'category': GOLDEN_GLOBES.categories[12]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ludwig Göransson',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Tenet.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Tenet',
            'link': 'https://www.imdb.com/title/nm3234869',
            'category': GOLDEN_GLOBES.categories[12]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'James Newton Howard',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/News%20of%20the%20World.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'News of the World',
            'link': 'https://www.imdb.com/title/nm0006133',
            'category': GOLDEN_GLOBES.categories[12]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Atticus Ross, Trent Reznor',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Mank.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mank',
            'link': 'https://www.imdb.com/title/nm1589604',
            'category': GOLDEN_GLOBES.categories[12]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jon Batiste, Atticus Ross, Trent Reznor',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Soul.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Soul',
            'link': 'https://www.imdb.com/title/nm4456022',
            'category': GOLDEN_GLOBES.categories[12]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** FOURTEENTH CATEGORY**/
            'name': 'Fight For You - H.E.R.',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Judas%20and%20the%20Black%20Messiah.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Judas and the Black Messiah',
            'link': 'https://www.youtube.com/watch?v=exJq2NrAwdc',
            'category': GOLDEN_GLOBES.categories[13]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },

        {
            'name': 'Hear My Voice - Celeste',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Trial%20of%20the%20Chicago%207%2C%20The%20.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Trial of the Chicago 7',
            'link': 'https://www.youtube.com/watch?v=pnY9_DXMBis',
            'category': GOLDEN_GLOBES.categories[13]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },

        {
            'name': 'The lo Sì (Seen) - Laura Pausini',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Life%20Ahead%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Life Ahead',
            'link': 'https://www.youtube.com/watch?v=imjSm7FNmwE',
            'category': GOLDEN_GLOBES.categories[13]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Speak Now - Leslie Odom Jr.',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/One%20Night%20in%20Miami.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'One Night in Miami…',
            'link': 'https://www.youtube.com/watch?v=1vAvQ9Um8hQ',
            'category': GOLDEN_GLOBES.categories[13]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },

        {
            'name': 'The Tigress & Tweed - Andra Day',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/United%20States%20vs.%20Billie%20Holiday%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The United States vs. Billie Holiday',
            'link': 'https://www.youtube.com/watch?v=9n1Is2xHvdI',
            'category': GOLDEN_GLOBES.categories[13]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** FIFTEENTH CATEGORY **/
            'name': 'The Crown',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/tv-shows/the_crown_0.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/tt4786824',
            'category': GOLDEN_GLOBES.categories[14]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Lovecraft Country',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Lovecraft%20Country.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Lovecraft Country',
            'link': 'https://www.imdb.com/title/tt6905686',
            'category': GOLDEN_GLOBES.categories[14]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Mandalorian',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Mandalorian%2C%20The%20%282019%29.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Mandalorian',
            'link': 'https://www.imdb.com/title/tt8111088',
            'category': GOLDEN_GLOBES.categories[14]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ozark',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/film_tv-1/Ozark.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ozark',
            'link': 'https://www.imdb.com/title/tt5071412',
            'category': GOLDEN_GLOBES.categories[14]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ratched',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Ratched.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ratched',
            'link': 'https://www.imdb.com/title/tt7423538',
            'category': GOLDEN_GLOBES.categories[14]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** SIXTEENTH CATEGORY **/
            'name': 'Emily in Paris',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Emily%20in%20Paris.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Emily in Paris',
            'link': 'https://www.imdb.com/title/tt8962124',
            'category': GOLDEN_GLOBES.categories[15]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Flight Attendant',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Flight%20Attendant%2C%20The%20.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Flight Attendant',
            'link': 'https://www.imdb.com/title/tt1070874',
            'category': GOLDEN_GLOBES.categories[15]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Great',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Great%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Great',
            'link': 'https://www.imdb.com/title/tt2235759',
            'category': GOLDEN_GLOBES.categories[15]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Schitt\'s Creek',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Schitt%27s%20Creek.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Schitt\'s Creek',
            'link': 'https://www.imdb.com/title/tt3526078',
            'category': GOLDEN_GLOBES.categories[15]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ted Lasso',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Ted%20Lasso.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ted Lasso',
            'link': 'https://www.imdb.com/title/tt10986410',
            'category': GOLDEN_GLOBES.categories[15]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** SEVENTH CATEGORY **/
            'name': 'Normal People',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Normal%20People.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Normal People',
            'link': 'https://www.imdb.com/title/tt9059760',
            'category': GOLDEN_GLOBES.categories[16]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Queen\'s Gambit',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Queen%27s%20Gambit%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Queen\'s Gambit',
            'link': 'https://www.imdb.com/title/tt10048342',
            'category': GOLDEN_GLOBES.categories[16]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Small Axe',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Small%20Axe.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Small Axe',
            'link': 'https://www.imdb.com/title/tt3464896',
            'category': GOLDEN_GLOBES.categories[16]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'The Undoing',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Undoing%2C%20The.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Undoing',
            'link': 'https://www.imdb.com/title/tt8134470',
            'category': GOLDEN_GLOBES.categories[16]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Unorthodox',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_movies/Uorthodox.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Unorthodox',
            'link': 'https://www.imdb.com/title/tt9815454',
            'category': GOLDEN_GLOBES.categories[16]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** EIGHTEENTH CATEGORY**/
            'name': 'Cate Blanchett',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/cate_blanchett-hfpa.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Mrs. America',
            'link': 'https://www.imdb.com/title/nm0000949',
            'category': GOLDEN_GLOBES.categories[17]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Daisy Edgar-Jones',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/daisy-edgar-jones_0.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Normal People',
            'link': 'https://www.imdb.com/title/nm8402992',
            'category': GOLDEN_GLOBES.categories[17]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Shira Haas',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/shira-haas.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Unorthodox',
            'link': 'https://www.imdb.com/title/nm6024635',
            'category': GOLDEN_GLOBES.categories[17]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Nicole Kidman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/nicole_kidman_111216_lion_5c.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Undoing',
            'link': 'https://www.imdb.com/title/nm0000173',
            'category': GOLDEN_GLOBES.categories[17]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Anya Taylor-Joy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Anya_Taylor-Joy2020-02-19_15_pp-%20Magnus%20Sundholm.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Queen\'s Gambit',
            'link': 'https://www.imdb.com/title/nm5896355',
            'category': GOLDEN_GLOBES.categories[17]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** NINETEENTH CATEGORY **/
            'name': 'Bryan Cranston',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/bryan_cranston_041516_all_the_way_tv_1.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Your Honor',
            'link': 'https://www.imdb.com/title/nm0186505',
            'category': GOLDEN_GLOBES.categories[18]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jeff Daniels',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/jeff-daniels-052114-.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Comey Rule',
            'link': 'https://www.imdb.com/title/nm0001099',
            'category': GOLDEN_GLOBES.categories[18]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Hugh Grant',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/hugh_grant_20160804_650.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Undoing',
            'link': 'https://www.imdb.com/title/nm0000424',
            'category': GOLDEN_GLOBES.categories[18]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ethan Hawke',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/gettyimages-880549212.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Good Lord Bird',
            'link': 'https://www.imdb.com/title/nm0000160',
            'category': GOLDEN_GLOBES.categories[18]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Mark Ruffalo',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/mark_ruffalo.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'I Know This Much Is True',
            'link': 'https://www.imdb.com/title/nm0749263',
            'category': GOLDEN_GLOBES.categories[18]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTIETH CATEGORY **/
            'name': 'Olivia Colman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/olivia_colman-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/nm1469236',
            'category': GOLDEN_GLOBES.categories[19]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },

        {
            'name': 'Jodie Comer',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2020_possible_nominations_people.tar/2020%20Possible%20Nominations-People/Jodie%20Comer%200207019%20Killing%20Eve%20%28TV%29%201.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Killing Eve',
            'link': 'https://www.imdb.com/title/nm3069650r',
            'category': GOLDEN_GLOBES.categories[19]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Emma Corrin',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Emma_Corrin2020-03-02_18_pp.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/nm10128408',
            'category': GOLDEN_GLOBES.categories[19]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Laura Linney',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/laura_linney.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ozark',
            'link': 'https://www.imdb.com/title/nm0001473',
            'category': GOLDEN_GLOBES.categories[19]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Sarah Paulson',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/sarah_paulson_37.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ratched',
            'link': 'https://www.imdb.com/title/nm0005299',
            'category': GOLDEN_GLOBES.categories[19]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTY-FIRST CATEGORY **/
            'name': 'Jason Bateman',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/jason_bateman_062817_ozark_tv_1.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ozark',
            'link': 'https://www.imdb.com/title/nm0000867',
            'category': GOLDEN_GLOBES.categories[20]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Josh O\'Connor',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Josh_OConnor20160101_0151.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/nm4853066',
            'category': GOLDEN_GLOBES.categories[20]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Bob Odenkirk',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/bob_odenkirk_082316_better_call_saul_tv_1.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Better Call Saul',
            'link': 'https://www.imdb.com/title/nm0644022',
            'category': GOLDEN_GLOBES.categories[20]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Al Pacino',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/al_pacino.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Hunters',
            'link': 'https://www.imdb.com/title/nm0000199',
            'category': GOLDEN_GLOBES.categories[20]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Matthew Rhys',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/matthew_rhys-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Perry Mason',
            'link': 'https://www.imdb.com/title/nm0722629',
            'category': GOLDEN_GLOBES.categories[20]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTY-SECOND CATEGORY**/
            'name': 'Lily Collins',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/lily_collins_100616_rules_don_t_apply_00001.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Emily in Paris',
            'link': 'https://www.imdb.com/title/nm2934314',
            'category': GOLDEN_GLOBES.categories[21]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Kaley Cuoco',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Kaley%20Cuoco-GG76_0724.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Flight Attendant',
            'link': 'https://www.imdb.com/title/nm0192505',
            'category': GOLDEN_GLOBES.categories[21]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Elle Fanning',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Elle%20Fanning%20033119%20Teen%20Spirit%20C.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Great',
            'link': 'https://www.imdb.com/title/nm1102577',
            'category': GOLDEN_GLOBES.categories[21]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jane Levy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Jane%20Levy%201.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Zoey\'s Extraordinary Playlist',
            'link': 'https://www.imdb.com/title/nm3994408',
            'category': GOLDEN_GLOBES.categories[21]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Catherine O\'Hara',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Catherine%20O%E2%80%99Hara-GettyImages-1205150490.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Schitt\'s Creek',
            'link': 'https://www.imdb.com/title/nm0001573',
            'category': GOLDEN_GLOBES.categories[21]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTY-THIRD CATEGORY**/
            'name': 'Don Cheadle',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/don_cheadle.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Black Monday',
            'link': 'https://www.imdb.com/title/nm0000332',
            'category': GOLDEN_GLOBES.categories[22]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Nicholas Hoult',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Nicholas_Hoult042219_0-%20Magnus%20Sundholm.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Great',
            'link': 'https://www.imdb.com/title/nm0396558',
            'category': GOLDEN_GLOBES.categories[22]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Eugene Levy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Eugene_Levy_031120_Schitts_Creek_00001.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Schitt\'s Creek',
            'link': 'https://www.imdb.com/title/nm0506405',
            'category': GOLDEN_GLOBES.categories[22]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jason Sudeikis',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Jason_Sudeikis_102.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ted Lasso',
            'link': 'https://www.imdb.com/title/nm0837177',
            'category': GOLDEN_GLOBES.categories[22]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Ramy Youssef',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/articles/cover_images/ramy_youssef_040819_ramy_00001.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ramy',
            'link': 'https://www.imdb.com/title/nm3858973',
            'category': GOLDEN_GLOBES.categories[22]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTY-FOURTH CATEGORY**/
            'name': 'Gillian Anderson',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/gillian_anderson.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/nm0000096',
            'category': GOLDEN_GLOBES.categories[23]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Helena Bonham Carter',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/Helen%20Bonham%202013%20Winner%20Les%20Miserables_0.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Crown',
            'link': 'https://www.imdb.com/title/nm0000307',
            'category': GOLDEN_GLOBES.categories[23]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Julia Garner',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Julia%20Garner-GettyImages-1202181327.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ozark',
            'link': 'https://www.imdb.com/title/nm3400186',
            'category': GOLDEN_GLOBES.categories[23]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Annie Murphy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/annie-murphy_0.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Schitt\'s Creek',
            'link': 'https://www.imdb.com/title/nm2251884',
            'category': GOLDEN_GLOBES.categories[23]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Cynthia Nixon',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/cynthia-nixon.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Ratched',
            'link': 'https://www.imdb.com/title/nm0633223',
            'category': GOLDEN_GLOBES.categories[23]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            /** TWENTY-FIFTH CATEGORY**/
            'name': 'John Boyega',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021-02/john-boyega.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Small Axe',
            'link': 'https://www.imdb.com/title/nm3915784',
            'category': GOLDEN_GLOBES.categories[24]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Brendan Gleeson',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/brendan_gleeson-gt.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Comey Rule',
            'link': 'https://www.imdb.com/title/nm0322407',
            'category': GOLDEN_GLOBES.categories[24]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Daniel Levy',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/2021_possible_nominees/Possible_Nominees/Dan%20Levy%20031120%20Schitts%20Creek%20%28TV%29%202.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Schitt\'s Creek',
            'link': 'https://www.imdb.com/title/nm2391794',
            'category': GOLDEN_GLOBES.categories[24]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Jim Parsons',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/jim_parsons.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'Hollywood',
            'link': 'https://www.imdb.com/title/nm1433588',
            'category': GOLDEN_GLOBES.categories[24]._id,
            'awardEvent': GOLDEN_GLOBES._id,
        },
        {
            'name': 'Donald Sutherland',
            'pic': 'https://www.goldenglobes.com/sites/default/files/styles/portrait_medium/public/people/cover_images/donald_sutherland_-_hfpa.jpg?format=pjpg&auto=webp&optimize=high',
            'movie': 'The Undoing',
            'link': 'https://www.imdb.com/title/nm0000661',
            'category': GOLDEN_GLOBES.categories[24]._id,
            'awardEvent': GOLDEN_GLOBES._id,
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
