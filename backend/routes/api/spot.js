// backend/routes/api/users.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

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

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .exists({checkFalsy: true})
    // .isIn([1,5])
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]


const validateQuery  = [
  check("page")
    .optional()
    .isInt({min: 1, max: 10})
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({min: 1, max: 20})
    .withMessage("Size must be greater than or equal to 1"),
  check("minLat")
    .optional()
    .isDecimal()
    .isInt({min: -90})
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isDecimal()
    .withMessage("Maxium longitude is invalid"),
  check("minPrice")
    .optional()
    .isDecimal({min:0})
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isDecimal({min:0})
    .withMessage("Maxium price must be greater than or equal to 0"),
  handleValidationErrors
]

// get all spots
router.get(
    '/', validateQuery,
    async (req, res) => {
      let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

      if(!size){ size = 20}
      if(!page){ page = 1}

      size = parseInt(size)
      page = parseInt(page)

      let pagination = {}

      if(page >= 0 && size > 0){
        pagination.offset = size * (page-1)
        pagination.limit = size
      }

      let arr = []

      if(minLat)  arr.push({lat: {[Op.gte] : Number(minLat)}})

      if(maxLat) arr.push({lat: {[Op.lte]: Number(maxLat)}})

      if(minLng) arr.push({lng: {[Op.gte]: Number(minLng)}})

      if(maxLng) arr.push({lng: {[Op.lte] : Number(maxLat)}})

      if(minPrice) arr.push({price: {[Op.gte] : Number(minPrice)}})

      if(maxPrice) arr.push({price: {[Op.lte] : Number(maxPrice)}})



      let spots =  await Spot.findAll({
        where: {
          [Op.and]: [
            ...arr
          ]
        },
        ...pagination
      })


      for(let spot of spots ){

        const avgStars = await spot.getReviews({
            attributes: [
                [
                    sequelize.fn('AVG', sequelize.col("stars")), "avgRating"
                ]
            ]
        })

        let avgRating = avgStars[0].dataValues.avgRating



        spot.dataValues.avgRating = parseFloat(Number(avgRating).toFixed(1)) //passed in local


      let image = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          preview: true,
          spotId: spot.id
        }
      })

      if(image){
        spot.dataValues.previewImage = image.dataValues.url
      }else if(!image){
        spot.dataValues.previewImage = ''
      }
    }


      return res.json({Spots: spots, page, size})


    }
  );

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res)=>{
  const currentUserSpots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    }
  })
  for(let spot of currentUserSpots){

    const allStars = await spot.getReviews({
      attributes: [[sequelize.fn('AVG', sequelize.col("stars")), "avgRating"]]
    })

    let avgRating = allStars[0].dataValues.avgRating
    spot.dataValues.avgRating = parseFloat(Number(avgRating).toFixed(1))

    const image = await SpotImage.findOne({
      where: {
        spotId: spot.id
      }
    })
    if(image){
      spot.dataValues.previewImage = image.url
    } else {
      spot.dataValues.previewImage = ""
    }
  }
  return res.json({Spots: currentUserSpots})
})

// Get details of a Spot from an id
router.get(
  '/:spotId',
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [{
        model: User,
        as: 'Owner'
      }]
    });

    // If the spot was not found, return a 404 response
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    }

    // Find all images for the spot
    const images = await SpotImage.findAll({
      where: {
        spotId: spot.id
      }
    });

    // Calculate the average rating of the spot
    const avgRating = await Review.findAll({
      where: {
        spotId: spot.id
      },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgStars']]
    }).then(results => {
      return results[0].dataValues.avgStars;
    });

    // If the spot was found, format the owner's name and return the spot in the response
    const formattedSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.numReviews,
      avgStarRating: avgRating,
      SpotImages: images,
      Owner: {
        id: spot.Owner.id,
        firstName: spot.Owner.firstName,
        lastName: spot.Owner.lastName
      }
    };
    res.json(formattedSpot);
  }


);


//Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const {address, city, state, country, lat, lng, name, description, price} = req.body

  if(!address || !city || !state || !country || !lat || !lng || !name || !description || !price){
    let obj = {
      message: "Validation Error",
      statusCode: 400,
      errors: []
    }

    if(!address){
      obj.errors.push("Street address is required")
    }

    if(!city){
      obj.errors.push("City is required")
    }

    if(!state){
      obj.errors.push("State is required")
    }

    if(!country){
      obj.errors.push("Country is required")
    }

    if(!lat){
      obj.errors.push("Latitude is required")
    }

    if(!lng){
      obj.errors.push("Longitude is required")
    }

    if(name.length > 50){
      obj.errors.push("Name must be less than 50 characters")
    }

    if(!description){
      obj.errors.push("Description is required")
    }

    if(!price){
      obj.errors.push("Price per day is required")
    }

   return res.json(obj)
  }


  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })


  return res.status(201).json(newSpot)
});


//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {

  const currentSpot = await Spot.findByPk(req.params.spotId)

  if(!currentSpot){
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }


  const {url, preview} = req.body

  const spotId = req.params.spotId

  const newImage = await SpotImage.create({
    spotId: spotId,
    url,
    preview
  })

  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview
  })
});


//Edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {

  const currentUserId = req.user.id

  let spotsOwnedByUser = await Spot.findAll({
    where: {
      id: req.params.spotId,
      ownerId: currentUserId
    }
  })

  if(!spotsOwnedByUser){
    throw new Error('Spot must belong to the current user')
  }
  const currentSpot = await Spot.findByPk(req.params.spotId)
  const {address, city, state, country, lat, lng, name, description, price} = req.body

  if(!address || !city || !state || !country || !lat || !lng || !name || !description || !price){
    let obj = {
      message: "Validation Error",
      statusCode: 400,
      errors: []
    }

    if(!address){
      obj.errors.push("Street address is required")
    }

    if(!city){
      obj.errors.push("City is required")
    }

    if(!state){
      obj.errors.push("State is required")
    }

    if(!country){
      obj.errors.push("Country is required")
    }

    if(!lat){
      obj.errors.push("Latitude is required")
    }

    if(!lng){
      obj.errors.push("Longitude is required")
    }

    if(name && name.length > 50){
      obj.errors.push("Name must be less than 50 characters")
    }

    if(!description){
      obj.errors.push("Description is required")
    }

    if(!price){
      obj.errors.push("Price per day is required")
    }

    return res.status(400).json(obj)
  }

if(!currentSpot){
  res.status(404).json(
    {
      message: "Spot couldn't be found",
      statusCode: 404
    }
  )
}


  if(address){
    currentSpot.address = address
  }
  if(city){
    currentSpot.city = city
  }
  if(state){
    currentSpot.state = state
  }
  if(country){
    currentSpot.country = country
  }
  if(lat){
    currentSpot.lat = lat
  }
  if(lng){
    currentSpot.lng = lng
  }
  if(name){
    currentSpot.name = name
  }
  if(description) {
    currentSpot.description = description
  }
  if(price) {
    currentSpot.price = price
  }
  currentSpot.save()
  res.json(currentSpot)



});

//delete a spot
router.delete('/:spotId', requireAuth, restoreUser, async(req, res)=>{
  const spot = await Spot.findByPk(req.params.spotId)
  if(!spot){
    return res.status(404).json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  await spot.destroy()
  return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
  })
});



//Get all Reviews by a Spot's id

router.get('/:spotId/reviews', async(req, res) => {
  let spotId = req.params.spotId;

  let spot = await Spot.findByPk(parseInt(spotId))

  if(!spot){
    res.statusCode = 404
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  let reviews = await Review.findAll({
    where: {
      spotId: parseInt(spotId)
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: ReviewImage,
      attributes: ['id', 'url']
    }
    ]
  })

  //res.json(reviews)
  res.json({Reviews: reviews})
})



//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', validateReview, async(req, res) => {
  const {review, stars} = req.body

  let spotId = req.params.spotId;

  let spot = await Spot.findByPk(parseInt(spotId))

  if(!spot){
    res.statusCode = 404
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  let obj = {
    message: "Validation error",
    statusCode: 400,
    errors: []
  }
  if(!review){
    obj.errors.push("Review text is required")
  }
  if(stars < 1 || stars > 5){
    obj.errors.push("Stars must be an integer from 1 to 5")
  }
if(!review || (stars < 1 || stars > 5)){
  return res.status(400).json(
    obj
  )
}


  //check if Review from the current user already exists for the Spot
  const reviewCheck = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: spot.id
    }
  })
  if(reviewCheck){
    return res.status(403).json({
      "message": "User already has a review for this spot",
      "statusCode": 403
    })
  }

  let newReview = await Review.create({
    userId: req.user.id,
    spotId: spot.id,
    review,
    stars
  })
  res.json(newReview)
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth,  async(req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if(!spot){
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }
  let bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  if(!bookings.length){
    return res.status(404).json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }


  if(req.user.id !== spot.ownerId){
    const nonOwnerBookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      },
      attributes: {
        exclude: [['createdAt', 'updatedAt','id','userId']]
      }
    })
    return res.status(200).json({Bookings: nonOwnerBookings})
  } else {
    const ownerBookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId
      },
      include: [{
        model: User,
        attributes: ['id','firstName','lastName']
      }]
    })
    return res.status(200).json({Bookings: ownerBookings})
  }


})


//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, validateBooking, async(req, res) => {
 // Find the spot by its id
    const spot = await Spot.findByPk(req.params.spotId);

    // If the spot was not found, return a 404 response
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
      });
    }

    // Check if the spot belongs to the current user
    if (spot.ownerId === req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
        statusCode: 401
      });
    }

    // Check if the start date and end date are valid
    if (req.body.startDate > req.body.endDate) {
      return res.status(400).json({
        message: "Validation error",
        statusCode: 400,
        errors: ["endDate cannot be on or before startDate"]
      });
    }

    // Check if the spot is available for the specified dates
    const existingBooking = await Booking.findOne({
      where: {
        spotId: spot.id,
        [Sequelize.Op.or]: [
          {
            startDate: {
              [Sequelize.Op.lte]: req.body.startDate
            },
            endDate: {
              [Sequelize.Op.gte]: req.body.startDate
            }
          },
          {
            startDate: {
              [Sequelize.Op.lte]: req.body.endDate
            },
            endDate: {
              [Sequelize.Op.gte]: req.body.endDate
            }
          },
          {
            startDate: {
              [Sequelize.Op.gte]: req.body.startDate
            },startDate: {
              [Sequelize.Op.lte]: req.body.startDate
            },
            endDate: {
              [Sequelize.Op.gte]: req.body.endDate
            }
          }
        ]
      }
    });

    if (existingBooking) {
      const errors = [];
      if (existingBooking.startDate <= req.body.startDate && existingBooking.endDate >= req.body.startDate) {
        errors.push("Start date conflicts with an existing booking");
      }
      if (existingBooking.startDate <= req.body.endDate && existingBooking.endDate >= req.body.endDate) {
        errors.push("End date conflicts with an existing booking");
      }
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: [
          "Start date conflicts with an existing booking",
          "End date conflicts with an existing booking"
        ]
      });
    }

    // If the booking is valid, create it and return the new booking object
    const newBooking = await Booking.create({
      spotId: spot.id,
      userId: req.user.id,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    res.json(newBooking);
})


module.exports = router;
