// backend/routes/api/reviews.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

//Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res)=>{
    const image = await SpotImage.findByPk(req.params.imageId)
    if(!image){
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
          })
    }

    const spot = await Spot.findByPk(image.spotId)

    if(spot.ownerId !== req.user.id){
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
          })
    } else {
       await image.destroy()
       return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
      })
    }


})


module.exports = router;
