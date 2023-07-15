// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

///1-Delete a SpotImage ///////

router.delete('/:imageId', requireAuth,

    async (req, res) => {
        const userId = req.user.id;
        const imageId = req.params.imageId

        // Check if the review exists
        const spotImageEx = await SpotImage.findByPk(imageId);

        if (!spotImageEx) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }
        ///check if a review belongs to current user //////
        const theSpot = await Spot.findOne({ where: { id: spotImageEx.spotId } })

        // console.log ('******************************', theSpot.ownerId)
        // console.log('******************************', spotImageEx.ownerId)
        // console.log('******************************', spotImageEx)

        if (theSpot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }


        const deletedSpotImage = await SpotImage.findOne({ where: { id: imageId } })
        await deletedSpotImage.destroy()


        return res.status(200).json({ message: 'Successfully deleted' });

    });

module.exports = router;
