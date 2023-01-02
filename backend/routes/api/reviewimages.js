// backend/routes/api/reviews.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const reviewImage = await ReviewImage.findOne({
      where: {
          id: req.params.imageId
      },
      include: [
          {
              model: Review
          }
      ]
  })


  if(!reviewImage){
      res.status(404)
      return res.json({
          "message": 'Review Image could not be found',
          "statusCode": 404
      })
  } else if (reviewImage.Review.userId !== req.user.id){
      res.status(403)
      return res.json({
          "message": "Forbidden",
          "statusCode": 403
      })
  } else {
      await reviewImage.destroy()

      return res.json({
          "message": "Successfully deleted",
          "statusCode": 200
      })
  }
})

module.exports = router;
