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
    const { startDate, endDate } = req.body
    const currentBooking = await Booking.findByPk(req.params.bookingId)
    //Error response: Can't edit a booking that's past the end date
    if(new Date(startDate) >= currentBooking.endDate){
        res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })
    }
    //Error response: Booking conflict
    const bookings = bookings.findAll()
    for(let booking of bookings){
        if(booking.dataValues.startDate <= new Date(startDate) && booking.dataValues.endDate >= new Date(startDate)){
          return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: {
              "endDate": "End date conflicts with an existing booking"
            }
          })
        }else if (booking.dataValues.endDate >= new Date(endDate) && booking.dataValues.startDate <= new Date(endDate)){
          return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: {
              "startDate": "Start date conflicts with an existing booking",
            }
          })
        }
       }


    if(!currentBooking){
        res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
          })
    }else {
        if(starDate){
            currentBooking.starDate = starDate
        }
        if(endDate) {
            currentBooking.endDate = endDate
        }
        currentBooking.save()
        return res.json(currentBooking)
    }



  });


//delete a booking

router.delete('/:bookingId', requireAuth, async(req, res)=>{
    const booking = await Booking.findByPk(req.params.bookingId)
    if(!booking){
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
          })
    }
    const today = new Date()
    if(booking.starDate > today){
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted",
            statusCode: 403
          })
    }
    booking.destroy()
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
      })
})








module.exports = router;
