// backend/routes/api/users.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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


// get all spots
router.get(
    '/',
    async (req, res) => {
      let spots =  await Spot.findAll({
      })
      let reviews = await Review.findAll({
        attributes: ['spotId', 'stars']
      })

    for(let i = 0; i < spots.length; i++){
      let arr = []

      let stars = await Review.findAll({
        attributes: ['spotId', 'stars'],
        where: {
          spotId: spots[i].id
        }
      })

      arr = stars.map(x => x.dataValues.stars)

      let sum = arr.reduce((a, b) => a + b);
      let avg = (sum / arr.length);

      spots[i].dataValues.avgRating = avg


      let image = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          preview: true,
          spotId: spots[i].id
        }
      })

      if(image){
        spots[i].dataValues.previewImage = image.dataValues.url
      }
    }


      return res.json({
        Spots: spots
      })


    }
  );

// Get all Spots owned by the Current User
router.get(
  '/current', requireAuth,
  async (req, res) => {
    const currentUserId = req.user.id
    let spotsOwnedByUser = await Spot.findAll({
      where: {
        ownerId: currentUserId
      }
    })

    for(let i = 0; i < spotsOwnedByUser.length; i++){
      let arr = []

      let stars = await Review.findAll({
        attributes: ['spotId', 'stars'],
        where: {
          spotId: spotsOwnedByUser[i].id
        }
      })

      arr = stars.map(x => x.dataValues.stars)

      let sum = arr.reduce((a, b) => a + b);
      let avg = (sum / arr.length);

      spotsOwnedByUser[i].dataValues.avgRating = avg


      let image = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          preview: true,
          spotId: spotsOwnedByUser[i].id
        }
      })

      if(image){
        spotsOwnedByUser[i].dataValues.previewImage = image.dataValues.url
      }
    }


      return res.json({
        spotsOwnedByUser
      })

  }
);

// Get details of a Spot from an id
router.get(
  '/:spotId',
  async (req, res) => {

    if(isNaN(parseInt(req.params.spotId))){
      res.statusCode = 404
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }


    let thisSpot = await Spot.findByPk(req.params.spotId)
    let numReviews = await Review.findAll({
      where: {
        spotId: parseInt(req.params.spotId)
      }
    })

    thisSpot.dataValues.numReviews = numReviews.length

    let stars = await Review.findAll({
      attributes: ['spotId', 'stars'],
      where: {
        spotId: parseInt(req.params.spotId)
      }
    })

    arr = stars.map(x => x.dataValues.stars)

    let sum = arr.reduce((a, b) => a + b);
    let avg = (sum / arr.length);

    thisSpot.dataValues.avgRating = avg

    thisSpot.dataValues.SpotImages = await SpotImage.findAll({
      where: {
        spotId: parseInt(req.params.spotId)
      },
      attributes: ['id', 'url', 'preview']
    })


    thisSpot.dataValues['Owner'] = await User.findOne({
      where: {
        id: thisSpot.ownerId
      },
      attributes: ['id', 'firstName', 'lastName']
    })

    res.json(thisSpot)
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
    return res.json({
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

module.exports = router;
