// backend/routes/api/reviews.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .exists({checkFalsy: true})
    .isInt({min:1, max:5})
    .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//get all reviews of current user
router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const reviews = await Review.findAll({
      where: {
        userId: req.user.id
      },
      //eager loading
      include: [
       { model: User,
        attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: {
            exclude: ['createdAt','updatedAt','description']
          }
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    })
    //add preview image to spot in return object
    for(let review of reviews){
      let currentSpot = await Spot.findByPk(review.spotId);
      let currentSpotImage = await SpotImage.findAll({
        where: {
          spotId: currentSpot.id,
          preview: true
        }
      })
      if(currentSpotImage){
        review.dataValues.previewImage = currentSpotImage.url
      }else{
        review.dataValues.previewImage = ""
      }
    }
    return res.status(200).json({Reviews: reviews})
  });

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req,res)=>{
  const review = await Review.findByPk(req.params.reviewId)

  const { url } = req.body

  if(!review){
      return res.status(404).json({
          "message": "Review couldn't be found",
          "statusCode": 404
        })
  }

  //10 images per review
  const images = await ReviewImage.findAll({
    where: {
        reviewId: req.params.reviewId
    }
})
if(images.length >= 10){
  return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
      statusCode: 403
    })
}

//creating new image for review
const newImage = await ReviewImage.create({
  reviewId: req.params.reviewId,
  url
})
const response = await ReviewImage.findByPk(newImage.id,
 { attributes: ['id','url']}
    )


  return res.status(200).json(response)
})

//Edit a Review
router.put('/:reviewId', requireAuth, validateReview, async (req,res)=>{
  const {review, stars} = req.body
  const reviewToEdit  = await Review.findByPk(req.params.reviewId)

  if(!reviewToEdit){
    return res.status(404).json({
        "message": "Review couldn't be found",
        "statusCode": 404
      })
} else {
    if(review){
        reviewToEdit.review = review
    }
    if(stars){
        reviewToEdit.stars = stars
    }
    reviewToEdit.save()
    return res.json(reviewToEdit)
}
})

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res)=>{
 // Find the review image by its id
 const reviewImage = await ReviewImage.findByPk(req.params.imageId);

 // If the review image was not found, return a 404 response
 if (!reviewImage) {
   return res.status(404).json({
     message: "Review Image couldn't be found",
     statusCode: 404
   });
 }

 // Find the review associated with the review image
 const review = await Review.findByPk(reviewImage.reviewId);

 // Check if the review belongs to the current user
 if (review.userId !== req.user.id) {
   return res.status(401).json({
     message: "Unauthorized",
     statusCode: 401
   });
 }

 // Delete the review image
 await reviewImage.destroy();

 res.json({
   message: "Successfully deleted",
   statusCode: 200
 });
})


module.exports = router;
