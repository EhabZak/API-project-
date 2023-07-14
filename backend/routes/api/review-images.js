// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

///1-Delete a review Image ///////

router.delete('/:imageId', requireAuth,

    async (req, res) => {
        const userId = req.user.id;
        const imageId = req.params.imageId

        // Check if the review exists
        const reviewImageEx = await ReviewImage.findByPk(imageId);

        if (!reviewImageEx) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }
        ///check if a review belongs to current user //////
        const theReview = await Review.findOne({ where: { id: reviewImageEx.reviewId } })


        // console.log('******************************', reviewImageEx)

        if (theReview.userId !== userId) {
            return res.status(403).json({ message: "Unauthorized user" });
        }


        const deletedReviewImage = await ReviewImage.findOne({ where: { id: imageId } })
        await deletedReviewImage.destroy()


        return res.status(200).json({ message: 'Successfully deleted' });

    });

module.exports = router;
