'use strict';
const mongoose = require('mongoose');
const Vote = mongoose.model('Votes');
const User = mongoose.model('Users');
const Award = mongoose.model('AwardEvents');
const Jimp = require('jimp');
const path = require("path");
const fs = require('fs')

const pictureRoute = '/assets/render-template.png';

exports.createVotes = async function (req, res) {
    const {userId, votes} = req.body;
    const award = req.params.awardId;

    if (Array.isArray(votes)) {
        let promises = [];

        const user = await User.findById(userId);
        if (!user) res.status(404).json('User not found');

        const awardEvent = await Award.findById(award);
        if (!awardEvent) res.status(404).json('Award event not found');

        await votes.forEach((v) => {
            let newVote = new Vote({user, awardEvent, ...v})
            promises.push(newVote.save());
        })
        try {
            let result = await Promise.all(promises);
            if (!result) {
                return res.status(500).json({message: 'An error occurred in server when saving votes', flag: 3});
            }

            user.votes = [...user.votes, ...result.map(r => r._id)];

            let userRes = await user.save();
            if (!userRes) {
                return res.status(500).json({
                    message: 'Votes were saved but an error avoid them to be assign to an user',
                    flag: 1
                });
            }
            return res.status(201).json({
                message: "All votes were emitted and assigned",
                flag: 0,
            });

        } catch (error) {
            return res.status(500).json({message: 'An error occurred in server when saving votes', flag: 2});
        }
    }
    return res.status(400).json({message: "Content sent in a wrong format. Expected an array", flag: 4});
}

exports.renderImage = async function (req, res) {
    let user = await User.findById(req.params.userId);
    const username = (user) ? user.name : 'XXXXXX';

    let data = req.body.data;

    let filename = await renderer(data, username)

    const options = {
        // root: appRoot,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        }
    }

    fs.access(filename, fs.F_OK, (err) => {
            if (err) {
                console.err(err);
                return res.status(500).json({'message': 'Error at generating the picture (maybe timeout)', err})
            }
            console.log("Success at rendering")
            res.sendFile(filename, options, function (error) {
                if (error) {
                    console.error("An error ocurren when sending data".bgRed, error);
                    res.status(500).json({message: 'Something went wrong at sending the rendered picture', error});
                }
                console.log("Picture sent successfully".bgGreen);
                fs.unlink(filename, (err) => {
                    if (err) {
                        console.error(err)
                        return;
                    }
                    console.log(`File deleted: ${filename}`);
                })
            });
        }
    )
    ;
}

async function renderer(data, username) {
    console.log("Setting up configuration");
    const MAX_ROW = 5;
    const MAX_COL = 5;
    let matrix = new Array(MAX_ROW);
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(MAX_COL);
    }
    let c = 0;
    let s;
    for (let i = 0; i < MAX_ROW; i++) {
        for (let j = 0; j < MAX_COL; j++) {
            matrix[i][j] = data[c++]
            if (matrix[i][j]) s = c - 1;
        }
    }

    const renderTitle = `${username}\'s ${data[s].awardEvent.name} ${data[s].awardEvent.edition}\'s prediction`;
    const distanceX = 435;
    const distanceY = 210;
    const titleRelPicX = 0;
    const titleRelPicY = 0;
    const descRelPicX = 0;
    const descRelPicY = 0;
    const maxCardTextWidth = 190;
    // const marginLeft = 62;


    console.log("Preparing rendering...");
    try {
        let pic = await Jimp.read(appRoot + pictureRoute);
        if (pic) console.log("Template loaded");
        else {
            console.err("Error at loading template");
            return false;
        }

        let fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        let fontCategory = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
        let fontName = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        let fontDesc = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
        if (fontName) console.log("Fonts loaded");
        else {
            console.err("Error at loading font:", Jimp.FONT_SANS_64_WHITE)
            return false;
        }

        console.log("Embedding items...")
        for (let c = 0; c < MAX_COL; c++) {
            for (let r = 0; r < MAX_ROW; r++) {
                if (matrix[c][r]) {

                    //embedding thumbnail
                    const picX = distanceX * r + 62;
                    const picY = distanceY * c + 62 + 86;

                    let thumbnail = await Jimp.read({url: matrix[c][r].voted.pic});
                    if (thumbnail) await thumbnail.scale(0.46)
                    await pic.composite(thumbnail, picX, picY);

                    //embedding category
                    await pic.print(fontCategory, picX + 150, picY + 5, {
                        text: matrix[c][r].category,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                    }, maxCardTextWidth)

                    //embedding name
                    await pic.print(fontName, picX + 150, picY + 50, {
                        text: matrix[c][r].voted.name,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                    }, maxCardTextWidth)

                    //embedding description
                    if (matrix[c][r].voted.name !== matrix[c][r].voted.movie)
                        await pic.print(fontDesc, picX + 150, picY + 141, {
                            text: matrix[c][r].voted.movie,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                        }, maxCardTextWidth)
                }
            }
        }

        await pic.print(fontTitle, 200, 30,
            {
                text: renderTitle,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, 1800
        );
        const filename = `${appRoot}/assets/rendered_pictures/${username}_${Date.now}.png`;
        await pic.writeAsync(filename)
        return filename;
    } catch (err) {
        console.error(err);
        return false;
    }

}

