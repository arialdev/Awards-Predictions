'use strict';
const mongoose = require('mongoose');
const Vote = mongoose.model('Votes');
const User = mongoose.model('Users');
const Award = mongoose.model('AwardEvents');
const Jimp = require('jimp');
const path = require("path");

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
    let username = (await User.findById(req.params.userId)).name;

    await renderer(req.body, username)

    const options = {
        root: appRoot,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        }
    }
    return res.sendFile(`${options.root}/assets/rendered_pictures/${username}.png`);


}

async function renderer(data, username) {
    console.log("Preparing rendering")
    await Jimp.read(appRoot + pictureRoute).then(
        (pic) => {
            console.log("Template loaded");
            Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(font => {
                // pic.print(font, 500, 55, `${username}\'s ${data[0].awardEvent.name} ${data[0].awardEvent.edition}\'s prediction`, 1800);
                pic.print(font, 200, 55,
                    {
                        text: `${username}\'s ${data[0].awardEvent.name} ${data[0].awardEvent.edition}\'s prediction`,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                    }, 1800
                );
                pic.write(`${appRoot}/assets/rendered_pictures/${username}.png`)
            })
            return pic;

        }).catch(error => {
        console.error('Fail at loading template', error);
    });
}

