/// 1- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const {  check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');




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


///3-Get details for a Spot from an id /////////////////////////////////////////

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
                as:'owner',
                attributes: ['id', 'firstName', 'lastName']
            }

        ]

    })
//////////////////////////////////////

if(!spots){
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

    const {owner, SpotImages, ...rest } = spotsList;
    const finalSpotsList = {...rest, SpotImages, owner}

/////////////////////////////////////

    res.status(200).json(finalSpotsList);


});

///4- create a post /////////////////////////////////////

// router.post('/',requireAuth ,(req, res)=>{
// const {address,city,state,country, lat,lng,name,description,price} = req.body
// const userId = req.user.id
// const spot = {

//     ownerId: userId,
//     address: address,
//     city: city,
//     state: state,
//     country: country,
//     lat: lat,
//     lng: lng,
//     name: name,
//     description: description,
//     price: price,

// }

// const errors = check(req);
// res.status(200)
// res.json(spot)


// })
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

///add a new spot /////////////////////////
router.post('/', requireAuth, validateCreatePost,

   async (req, res) => {
try{
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

//////////////////////////////////////////////////////








module.exports = router;
