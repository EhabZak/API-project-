/// 1- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




const router = express.Router();

//////////////////////////////////////////////


router.get('/', async (req, res) => {


    const spots = await Spot.findAll({

        include: [
            { model: SpotImage },
            { model: Review },

        ]

    });



    /////////////////////////////////////////////
    let spotsList = [];
    // console.log(Review.stars)
    spots.forEach(spot => {
        spotsList.push(spot.toJSON())

    })

    // console.log(spotsList)

    spotsList.forEach(spot => {

        spot.SpotImages.forEach(image => {
            // console.log(image.preview)

            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = " no image found"
            // console.log(spot.previewImage)
        }

        delete spot.SpotImages
    })
    //////////////////////////////////////////
    spotsList.forEach(spot => { // we accessed the spot1 review 1 then to next spot

        const totalReviews = spot.Reviews.map(review => { // we accessed the review
            return review.stars
        })
        // console.log(totalReviews)
        let sumValues = 0;
        let count = 0;
        totalReviews.forEach(value => {
            sumValues += value;
            count++
        });

        let avgRating = count > 0 ? sumValues / count : 0;
        spot.avgRating = avgRating
        // console.log(avgRating)
        delete spot.Reviews
    })



    ///////////////////////////////////

    res.status(200)
    res.json({ Spots: spotsList });

});

////////////////////////////////////////////

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id

    const spotsCurrent = await Spot.findAll({
        where: {
            ownerId: userId
        },
        include: [
            { model: SpotImage },
            { model: Review }

        ]
    })

    let spotsList = [];
    spotsCurrent.forEach(spot => {
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
//////////////////////////////////////////////////////
spotsList.forEach(spot => { // we accessed the spot1 review 1 then to next spot

    const totalReviews = spot.Reviews.map(review => { // we accessed the review
        return review.stars
    })
    // console.log(totalReviews)
    let sumValues = 0;
    let count = 0;
    totalReviews.forEach(value => {
        sumValues += value;
        count++
    });

    let avgRating = count > 0 ? sumValues / count : 0;
    spot.avgRating = avgRating
    // console.log(avgRating)
    delete spot.Reviews
})



////////////////////////////////////////////////////


    res.status(200)
    res.json({ spots: spotsList })
})


/////////////////////////////////////////////






module.exports = router;
