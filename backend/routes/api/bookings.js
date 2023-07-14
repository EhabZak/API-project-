// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

///1- Get all of the Current User's Bookings ////////////////////////////////////////



router.get('/current', requireAuth, async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const bookingCurrent = await Booking.findAll({
        where: {
          userId: currentUserId
        },
        include: [
          {
            model: Spot,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: SpotImage,
                attributes: { exclude: ["createdAt", "updatedAt", "spotId"] }
              }
            ]
          }
        ]
      });

      const bookingList = bookingCurrent.map((booking) => {
        const spot = booking.Spot;

        spot.SpotImages.forEach((image) => {
          if (image.preview === true) {
            spot.previewImage = image.url;
          }
        });

        if (!spot.previewImage) {
          spot.previewImage = "no image found";
        }

        delete spot.SpotImages;
/// returning a new object with the desired layout
        return {
          id: booking.id,
          spotId: booking.spotId,
          Spot: {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            price: spot.price,
            previewImage: spot.previewImage
          },
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        };
      });

      res.status(200).json({ Bookings: bookingList });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
///2- Get all Bookings for a Spot based on the Spot's id///////






module.exports = router;
