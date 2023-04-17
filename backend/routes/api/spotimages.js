// backend/routes/api/reviews.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, Session, sequelize, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router()

//Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res)=>{
       // Find the spot image by its id
       const spotImage = await SpotImage.findByPk(req.params.imageId);

       // If the spot image was not found, return a 404 response
       if (!spotImage) {
         return res.status(404).json({
           message: "Spot Image couldn't be found",
           statusCode: 404
         });
       }

       // Find the spot associated with the spot image
       const spot = await Spot.findByPk(spotImage.spotId);

       // Check if the spot belongs to the current user
       if (spot.ownerId !== req.user.id) {
         return res.status(401).json({
           message: "Unauthorized",
           statusCode: 401
         });
       }

       // Delete the spot image
       await spotImage.destroy();

       res.json({
         message: "Successfully deleted",
         statusCode: 200
       });


})





module.exports = router;
