/// 1- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const reviewimage = require('../../db/models/reviewimage');



const router = express.Router();

//////////////////////////////////////////////


router.get('/', async (req, res) => {


    const spots = await Spot.findAll({

        include: {
            model: SpotImage,
            // as:'previewImage',

        }

    });

    let spotsList = [];
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())

    })
    spotsList.forEach(spot => {

        spot.SpotImages.forEach(image => {
            // console.log(image.preview)

            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = " no image found"
            console.log(spot.previewImage)
        }

        delete spot.SpotImages
    })


    res.status(200)
    res.json({ Spots: spotsList });

});

////////////////////////////////////////////

module.exports = router;
