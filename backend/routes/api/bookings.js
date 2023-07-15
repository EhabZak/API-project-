// 0- Create and export an Express router from this file

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const { Op } = require("sequelize");

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




///2- Edit a Booking///////

router.put('/:bookingId', requireAuth,

    async (req, res) => {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;

        const { startDate, endDate } = req.body;


        // Check if the booking exists
        const bookingEx = await Booking.findByPk(bookingId);
        if (!bookingEx) {
            return res.status(404).json({ message: "booking couldn't be found" });
        }



        ///check if a booking belongs to current user //////

        if (bookingEx.userId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
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

        // console.log("********************",startDate )
        // console.log('=====================', bookingEx.endDate)
        // Check if the booking has already ended

        const currentStartDate = new Date();
        const bookingEndDate = new Date(bookingEx.endDate);

        if (bookingEndDate < currentStartDate) {
            return res.status(403).json({ message: "Past bookings can't be modified" });
        }

        /// check if there is an existing booking ///////////////////
        const spotId = bookingEx.spotId;
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



        ///////////////////////////////////////
        bookingEx.startDate = startDate
        bookingEx.endDate = endDate

        const formattedBooking = {

            id: bookingEx.id,
            spotId: bookingEx.spotId,
            userId: bookingEx.userId,
            startDate: new Date(bookingEx.startDate).toISOString().split('T')[0],
            endDate: new Date(bookingEx.endDate).toISOString().split('T')[0],
            createdAt: new Date(bookingEx.createdAt),
            updatedAt: new Date(bookingEx.updatedAt)
        };



        const updatedBooking = await bookingEx.save();  /// I saved the bookingEx but used the formatted booking for the response
        return res.status(200).json(formattedBooking);


    });

///3-delete a booking///////////////////////////
router.delete('/:bookingId', requireAuth,

    async (req, res) => {
/// get user Id and booking Id and the attributes from the body///////

        const userId = req.user.id;
        const bookingId = req.params.bookingId

/// find the current booking /////////////////////////////////////
const bookingEx = await Booking.findByPk(bookingId);
 // Check if the booking exists
 if (!bookingEx) {
     return res.status(404).json({ message: "booking couldn't be found" });
 }


 ///check if a booking belongs to current user //////

 if (bookingEx.userId !== userId) {
     return res.status(403).json({ message: "Forbidden" });
 }


 // Compare if the booking has started with the current date
 const currentDate = new Date();
  if (bookingEx.startDate <= currentDate) {
    return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
  }

  ////////////////////////////////////////////////////////
        const deletedBooking = await Booking.findOne({ where: { id: bookingId } })
        await deletedBooking.destroy()


        return res.status(200).json({ message: 'Successfully deleted' });

    });

//////////////////////////////////////////////////////////////
module.exports = router;
