/// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spotimage = require('../../db/models/spotimage');
const { Op } = require("sequelize");



const router = express.Router();

/// 1-Get all spots ///////////////////////////////////////////



////////////////////////////////////////////////////////////////

router.get('/', async (req, res) => {

    /// filters ///////////////////////////////////////////////

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    const errors = {};
    const where = {};
    // Validate query parameters
    if (page < 1 || page > 10) {
        errors.page = 'Page must be between 1 and 10';
    }
    if (size < 1 || size > 20) {
        errors.size = 'Size must be between 1 and 20';
    }

    if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
        errors.minLat = 'Minimum latitude is invalid';
    } else if (minLat) {
        where.lat = { [Op.gte]: minLat }
    }
    if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
        errors.maxLat = 'Maximum latitude is invalid';
    } else if (maxLat) {
        where.lat = { ...where.lat, [Op.lte]: maxLat } ////////////////////////////////////////////
    }
    // console.log('*********************',where.lat)
    if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
        errors.minLng = 'Minimum longitude is invalid';
    } else if (minLng) {
        where.lng = { [Op.gte]: minLng }
    }
    if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
        errors.maxLng = 'Maximum longitude is invalid';
    } else if (maxLng) {
        where.lng = { ...where.lng, [Op.lte]: maxLng }
    }

    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
        errors.minPrice = 'Minimum price must be greater than or equal to 0';
    } else if (minPrice) {
        where.price = { [Op.gte]: minPrice }
    }
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
        errors.maxPrice = 'Maximum price must be greater than or equal to 0';
    } else if (maxPrice) {
        where.price = { ...where.price, [Op.lte]: maxPrice }
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: errors
        });
    }
    /// pagination //////////////////////////

    let pagination = {}

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page) || page < 0) page = 1;
    if (Number.isNaN(size) || size < 0) size = 20;


    pagination.limit = size;
    pagination.offset = (page - 1) * size
    //////////////////////////////////////////////////////////////////

    const spots = await Spot.findAll({
        where,
        ...pagination,

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
    res.json({ Spots: spotsList, page, size });

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
        .isLength({ min: 4 })
        .withMessage('Street address input is required'),

    check('city')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('City input is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('State input is required'),

    check('country')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Country input is required'),

    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .isLength({ min: 2 })
        .withMessage('Latitude input is not valid'),

    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal()
        .isLength({ min: 2 })
        .withMessage('Longitude input is not valid'),

    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .isLength({ min: 4 })
        .withMessage('Name input must be more than 4 and less than 50 characters'),

    check('description')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Description input is required'),

    check('price')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Price per day input is required'),
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

///5- add an img to a spot based on spot's id create an image for a spot ///////////////////////////////////////////////////

const validateNewImg = [
    check('url')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('url is required'),
    check('preview')
        // .exists({ checkFalsy: true })
        .isLength({ min: 4 })
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


    if (!spots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    ///check if a spot belongs to current user //////

    if (spots.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }



    /// create the attributes to be added
    const newImg = {
        spotId: spotId,
        url: url,
        preview: preview

    }

    // Create a new image object
    const CreateImg = await SpotImage.create(newImg)
    ///destructure  to get required attributes ///////////////////////
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
            return res.status(403).json({ message: "Forbidden" });
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
            return res.status(403).json({ message: "Forbidden" });
        }


        const deletedSpot = await Spot.findOne({ where: { id: spotId } })
        await deletedSpot.destroy()

        // const updatedSpot = await currSpot.save();
        return res.status(200).json({ message: 'Successfully deleted' });

    });



/// 8-Get all Reviews by a Spot's id//////////////////////////

router.get('/:spotId/reviews', async (req, res) => {
    // const thisUserId = req.user.id
    const spotId = req.params.spotId;

    const currReviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }


        ]
    });

    // console.log('**********************' , spotId)
    // console.log('**********************' , currReviews)

    // Check if the spot exists
    const spots = await Spot.findByPk(spotId);
    /////////////////////////////////

    if (!spots) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    //////////////////////////////////////
    if (currReviews.length === 0) {
        return res.status(200).json({});
    }


    //////////////////////////////////////////////

    res.status(200)
    res.json({ Reviews: currReviews })
})


/// 9-Create a Review for a Spot based on the Spot's id /////////////////
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]


router.post('/:spotId/reviews', requireAuth, validateReview,

    async (req, res) => {

        const userId = req.user.id;
        const spotId = parseInt(req.params.spotId);
        const { review, stars } = req.body;

        // Check if the spot exists ////////////////
        const spots = await Spot.findByPk(spotId);
        if (!spots) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // Check if the user already has a review for this spot ///////////
        const existingReview = await Review.findOne({
            where: {
                userId: userId,
                spotId: spotId,
            },
        });
        if (existingReview) {
            return res.status(500).json({ message: 'User already has a review for this spot' });
        }

        ///////////////////////////////////////////////
        const newReview = {
            userId: userId,
            spotId: spotId,
            review: review,
            stars: stars

        }

        // Create a new review object ///
        const CreateReview = await Review.create(newReview)


        res.status(200).json(CreateReview);
    });


///10- Get all Bookings for a Spot based on the Spot's id ///////////////////////

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const thisUserId = req.user.id
    const spotId = req.params.spotId;

    // Check if the spot exists //////////////////////
    const spots = await Spot.findByPk(spotId);
    /////////////////////////////////

    if (!spots) {
      return  res.status(404).json({ message: "Spot couldn't be found" });
    }
    //////////////////////////////////////

    const currBookings = await Booking.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            }

        ]
    });
    // console.log('**********************************' ,currBookings)
    if (currBookings.length === 0) {
        return res.status(404).json({ message: "There are no bookings for this spot" });
    }
    ////////////////////////////////////////////////////////////////////////////


    const formattedBookings = currBookings.map((booking) => {
        if (spots.ownerId === thisUserId) {
            return {
                User: {
                    id: booking.User.id,
                    firstName: booking.User.firstName,
                    lastName: booking.User.lastName
                },
                id: booking.id,
                spotId: booking.spotId,
                userId: booking.userId,
                startDate: new Date(booking.startDate).toISOString().split('T')[0],
                endDate: new Date(booking.endDate).toISOString().split('T')[0],
                createdAt: new Date(booking.createdAt),
                updatedAt: new Date(booking.updatedAt)
            };



        } else {

            const startDate = new Date(booking.startDate).toISOString().split('T')[0];
            const endDate = new Date(booking.endDate).toISOString().split('T')[0];

            return {
                spotId: booking.spotId,
                startDate: startDate,
                endDate: endDate
            }
            // res.status(200)
            // res.json({ Bookings: results })
        }
    });


  return  res.status(200).json({ Bookings: formattedBookings })

})


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const ValidateDate = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isDate()
        .withMessage('startDate is required'),
    check('endDate')
        .exists({ checkFalsy: true })
        .isDate()
        .withMessage('endDate is required'),
    handleValidationErrors

]



///11-Create a Booking from a Spot based on the Spot's id //////////////////////////

router.post('/:spotId/bookings', requireAuth, ValidateDate,
    async (req, res) => {
        const userId = req.user.id;
        const spotId = req.params.spotId;

        const { startDate, endDate } = req.body;

        // Check if the spot exists ////////////////
        const spots = await Spot.findByPk(spotId);
        if (!spots) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }
        /// check if the spot belongs to the current user ///////////////////

        if (spots.ownerId === userId) {
            return res.status(404).json({ message: "Own Spot can not be booked" });
        }

        ///check end date before start date ///////////////////////////
        if (endDate <= startDate) {
            return res.status(400).json({
                "message": "Bad Request",
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            });
        }
        //////////////////////////////////////////////////////////////
        const existingBooking = await Booking.findOne({
            where: {
                spotId: spotId,
                [Op.or]: [

                    {
                        startDate: {
                            [Op.between]: [startDate, endDate],

                        }
                    },
                    {
                        endDate: {
                            [Op.between]: [startDate, endDate],

                        }
                    }

                ]
            },
        });

        if (existingBooking) {
            return res.status(403).json({

                message: 'Sorry, this spot is already booked for the specified dates',
                errors: {
                    startDate: 'Start date conflicts with an existing booking',
                    endDate: 'End date conflicts with an existing booking'
                }

            });
        }

        ////////////////////////////////////////////////////////
        const newBooking = {
            spotId: spotId,
            userId: userId,
            startDate: startDate,
            endDate: endDate
        }

        // Create a new booking (replace this with your actual logic)
        const booking = await Booking.create(newBooking)

        // Return the created booking
        return res.status(200).json(booking);
    });
// Add Query Filters to Get All Spots /////////////////////////

// router.get('/', async (req, res) => {
// /// filters ///////////////////////////////////////////////
//     let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
//     const errors = {};
//     const where = {};
//     // Validate query parameters
//     if (page < 1 || page > 10) {
//         errors.page = 'Page must be between 1 and 10';
//     }
//     if (size < 1 || size > 20) {
//         errors.size = 'Size must be between 1 and 20';
//     }

//     if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
//         errors.minLat = 'Minimum latitude is invalid';
//     } else {
//         where.minLat = minLat
//     }

//     if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
//         errors.maxLat = 'Maximum latitude is invalid';
//     } else {
//         where.maxLat = maxLat
//     }
//     if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
//         errors.minLng = 'Minimum longitude is invalid';
//     } else {
//         where.minLng = minLng
//     }
//     if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
//         errors.maxLng = 'Maximum longitude is invalid';
//     } else {
//         where.maxLng = maxLng
//     }
//     if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
//         errors.minPrice = 'Minimum price must be greater than or equal to 0';
//     } else {
//         where.minPrice = minPrice
//     }
//     if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
//         errors.maxPrice = 'Maximum price must be greater than or equal to 0';
//       }else {
//         where.maxPrice = maxPrice
//       }

//       if (errors) {
//         return res.status(400).json({
//           message: 'Bad Request',
//           errors: errors
//         });
//       }
// /// pagination //////////////////////////

// let pagination = {}

// page = parseInt(page);
// size = parseInt(size);

// if (Number.isNaN(page) || page < 0)  page = 1;
// if (Number.isNaN(size) || size < 0)  size = 20;
// if (size > 10) size = 10;

// pagination.limit = size;
// pagination.offset = (page-1) * size




// })





////////////////////////////////////////////////////////////////////
module.exports = router;
