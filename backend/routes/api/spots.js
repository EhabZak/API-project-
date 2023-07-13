/// 1- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const spotimage = require('../../db/models/spotimage');




const router = express.Router();

/// 1-Get all spots ///////////////////////////////////////////


router.get('/', async (req, res) => {


    const spots = await Spot.findAll({

        include: [
            { model: SpotImage },
            { model: Review },

        ]

    });



    ///image url //////////////////////////////////////////
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
    ///AVG rating ///////////////////////////////////////
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

/// 2-Get all Spots owned by the Current User////////////////////////////////////

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
            // console.log(spot.previewImage)
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


///3-Get details of a Spot from an id /////////////////////////////////////////

router.get('/:id', async (req, res) => {
    // const spotId = parseInt(req.params.id);
    let spotId = req.params.id
    let spots;
    // Find the spot in the data source
    spots = await Spot.findByPk(spotId, {
        include: [
            {

                model: Review
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                as: 'owner',
                attributes: ['id', 'firstName', 'lastName']
            }

        ]

    })
    //////////////////////////////////////

    if (!spots) {
        res.status(404).json({ message: "Spot couldn't be found" });
    }
    /////////////////////////////////
    let spotsList = spots.toJSON();

    // console.log(spotsList)

    // we accessed the spot1 review 1 then to next spot

    const totalReviews = spotsList.Reviews.map(review => { // we accessed the review
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
    spotsList.numReviews = totalReviews.length
    spotsList.avgStarRating = avgRating
    // console.log(avgRating)
    delete spotsList.Reviews
    ///destructing to get the required order //////////////////////////////

    const { owner, SpotImages, ...rest } = spotsList;
    const finalSpotsList = { ...rest, SpotImages, owner }

    /////////////////////////////////////

    res.status(200).json(finalSpotsList);


});


////////////////////////////////////////////////
const validateCreatePost = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),

    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),

    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),

    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Latitude is not valid'),

    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Longitude is not valid'),

    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),

    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),

    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors

]

///4-create spot /////////////////////////
router.post('/', requireAuth, validateCreatePost,

    async (req, res) => {
        try {
            const { address, city, state, country, lat, lng, name, description, price } = req.body;
            const userId = req.user.id;
            const spot = {
                ownerId: userId,
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price,
            };

            // to create a new Spot record
            const createdSpot = await Spot.create(spot);

            return res.status(201).json(createdSpot);
        } catch (error) {
            // to handle any errors that occur during the creation of the Spot record
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    });

///5- add an img to a spot based on spot's id ///////////////////////////////////////////////////

const validateNewImg = [
    check('url')
        .exists({ checkFalsy: true })
        .withMessage('url is required'),
    check('preview')
        .exists({ checkFalsy: true })
        .withMessage('preview is required'),
    handleValidationErrors
]
///////////////////////////////////////
router.post('/:id/images', requireAuth, validateNewImg, async (req, res) => {
    const userId = req.user.id;

    const spotId = req.params.id;
    const { url, preview } = req.body;

    // Check if the spot exists
    const spots = await Spot.findByPk(spotId);

    console.log('req.spot.ownerId======', spots.ownerId)
    // console.log("*************************spots", spots)
    if (!spots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (spots.ownerId !== userId) {
        return res.status(403).json({ message: "Unauthorized user" });
    }
    ///check if a spot belongs to current user //////

    if (spotId) { }

    /// create the attributes to be added
    const newImg = {
        spotId: spotId,
        url: url,
        preview: preview

    }

    // Create a new image object
    const CreateImg = await SpotImage.create(newImg)
    //////////////////////////
    const result = {
        id: CreateImg.id,
        url: CreateImg.url,
        preview: CreateImg.preview
    };

    // Return the new image object
    res.status(200).json(result);
});



/// 6-edit a spot //////////////////////////////////////

router.put('/:spotId', requireAuth, validateCreatePost,

    async (req, res) => {


        /// get user Id and spot Id and the attributes from the body///////////////
        const userId = req.user.id;
        const spotId = req.params.spotId;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        /// find the current spot /////////////////////////////////////
        const currSpot = await Spot.findByPk(spotId);

        /// check if spot exists and user is authorized to change////////////////////////////
        if (!currSpot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        if (currSpot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized user" });
        }

        /// update the attributes //////////////////////////////////////////////////////


            currSpot.address = address;
            currSpot.city = city;
            currSpot.state = state;
            currSpot.country = country;
            currSpot.lat = lat;
            currSpot.lng = lng;
            currSpot.name = name;
            currSpot.description = description;
            currSpot.price = price;

            // to update a new Spot record
            // const createdSpot = await Spot.update(spot);
            const updatedSpot = await currSpot.save();
            return res.status(200).json(updatedSpot);


    });

///7- Delate a spot  ///////////////////////////////////////////////////

router.delete('/:spotId', requireAuth,

    async (req, res) => {


        /// get user Id and spot Id and the attributes from the body///////////////
        const userId = req.user.id;
        const spotId = req.params.spotId;
        // const { address, city, state, country, lat, lng, name, description, price } = req.body;

        /// find the current spot /////////////////////////////////////
        const currSpot = await Spot.findByPk(spotId);

        /// check if spot exists and user is authorized to change////////////////////////////
        if (!currSpot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        if (currSpot.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized user" });
        }


        const deletedSpot = await Spot.findOne({where:{id: spotId}})
        await deletedSpot.destroy()

        // const updatedSpot = await currSpot.save();
        return res.status(200).json({ message: 'Successfully deleted' });

    });











module.exports = router;
