// backend/routes/api/reviews.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

const validateBooking = [
    check('startDate')
      .exists({checkFalsy: true})
      .withMessage("Start date conflicts with an existing booking")
      .isDate()
      .withMessage("Please enter a date."),
    check('endDate')
      .exists({checkFalsy: true})
      .isAfter(this.startDate)
      .withMessage("End date conflicts with an existing booking")
      .isDate()
      .withMessage("Please enter a date."),
      handleValidationErrors
  ]


  //Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {

    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id,
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ['description','createdAt','updatedAt']
                }
            }
        ]
    })

      for(let booking of bookings){
      let currentSpot = await Spot.findByPk(booking.spotId);
      let currentSpotImage = await SpotImage.findAll({
        where: {
          spotId: currentSpot.id,
          preview: true
        }
      })
      if(currentSpotImage){
        booking.dataValues.previewImage = currentSpotImage.url
      }else{
        booking.dataValues.previewImage = ""
      }
    }

    return res.status(200).json({Bookings: bookings})
} )


//edit a booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res) => {
    let { startDate, endDate } = req.body

    //Error response: Can't edit a booking that's past the end date
    let editStartDate = Date.parse(startDate)
    let editEndDate = Date.parse(endDate)


    if (editEndDate <= editStartDate) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }


    const currentBooking = await Booking.findByPk(req.params.bookingId)

    if(!currentBooking){
      res.status(404).json({
          message: "Booking couldn't be found",
          statusCode: 404
        })
  }

  let oldStartDate = Date.parse(currentBooking.startDate)
  let oldEndDate = Date.parse(currentBooking.endDate)

  if (oldEndDate <= Date.parse(new Date())) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
      statusCode: 403,
    });
  }


  if (editEndDate >= oldEndDate && editStartDate <= oldStartDate) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      }
    });
  }

  const newBooking =  await currentBooking.update({
    startDate,
    endDate,
  });


  return res.status(200).json(newBooking);
  });


//delete a booking

router.delete('/:bookingId', requireAuth, async (req, res) => {

        // Find the booking by its id
        const booking = await Booking.findByPk(req.params.bookingId);

        // If the booking was not found, return a 404 response
        if (!booking) {
          return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
          });
        }

        // If the booking has already started, return a 403 response
        if (booking.startDate < new Date()) {
          return res.status(403).json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
          });
        }

        // Check if the booking belongs to the current user or the spot belongs to the current user
        if (booking.userId !== req.user.id) {
          const spot = await Spot.findByPk(booking.spotId);
          if (spot.ownerId !== req.user.id) {
            return res.status(401).json({
              message: "Unauthorized",
              statusCode: 401
            });
          }
        }

        // If the booking is valid, delete it and return a success message
        await booking.destroy();
        res.json({
          message: "Successfully deleted",
          statusCode: 200
        });
});









module.exports = router;
