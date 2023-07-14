/// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

/////////////////////////////////////////////////////////////////
const router = express.Router();


///1-Get all Reviews of the Current User ////////////////////////////////////////////////////////////

router.get('/current', requireAuth, async (req, res) => {
    const thisUserId = req.user.id

    const reviewsCurrent = await Review.findAll({
        where: {
            userId: thisUserId
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                    {
                        model: SpotImage,
                        attributes: { exclude: ["createdAt", "updatedAt", "spotId"] }
                    }
                ]

            },
            // { model: SpotImage },
            {
                model: ReviewImage,
                attributes: { exclude: ["createdAt", "updatedAt", "reviewId"] }

            }

        ]
    })

    let reviewList = []
    reviewsCurrent.forEach(review => {
        reviewList.push(review.toJSON())
    })

    // console.log(reviewList)
    reviewList.forEach(review => {
        const spot = review.Spot
        console.log(spot)

        spot.SpotImages.forEach(image => {
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


    res.status(200)
    res.json({ Reviews: reviewList })
})


///2-Add an Image to a Review based on the Review's id//////////////////////////////////////////////////

router.post('/:reviewId/images', requireAuth,

    async (req, res) => {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        const { url } = req.body;
// Check if the review exists
const reviewEx = await Review.findByPk(reviewId);
if (!reviewEx) {
    return res.status(404).json({ message: "Review couldn't be found" });
}
///check if a spot belongs to current user //////

if (reviewEx.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized user" });
}

// Check the number of existing images for the review
const imageCount = await ReviewImage.count({ where: { reviewId } });
if (imageCount >= 10) {
  return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
}

/// create the attributes to be added
const newImage = {
reviewId: reviewId,
url: url
}

// Create a new image object
const CreateImg = await ReviewImage.create(newImage)

/// destructure  to get required attributes //////////////////////////
const result ={
id: CreateImg.id,
url: CreateImg.url
}



        res.status(200).json(result);
    });



///3-Edit a Review ///////////////////////////////////////////

const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
    check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

router.put('/:reviewId', requireAuth, validateReview,

    async (req, res) => {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        const {review, stars} = req.body;

// Check if the review exists
const reviewEx = await Review.findByPk(reviewId);
if (!reviewEx) {
    return res.status(404).json({ message: "Review couldn't be found" });
}
///check if a spot belongs to current user //////

if (reviewEx.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized user" });
}

reviewEx.review = review;
reviewEx.stars = stars;

 // to update a new Spot record
        // const createdSpot = await Spot.update(spot);
        const updatedReview = await reviewEx.save();
        return res.status(200).json(updatedReview);


    });


    ///4- Delete a Review ///////////////////////////////
    router.delete('/:reviewId', requireAuth,

    async (req, res) => {
        const userId = req.user.id;
        const reviewId = req.params.reviewId;

        // Check if the review exists
const reviewEx = await Review.findByPk(reviewId);
if (!reviewEx) {
    return res.status(404).json({ message: "Review couldn't be found" });
}
///check if a spot belongs to current user //////

if (reviewEx.userId !== userId) {
    return res.status(403).json({ message: "Unauthorized user" });
}

const deletedReview = await Review.findOne({ where: { id: reviewId } })
        await deletedReview.destroy()


        return res.status(200).json({ message: 'Successfully deleted' });

    });

/// Export the middleware ///////////////////////////////////////////
module.exports = router;
