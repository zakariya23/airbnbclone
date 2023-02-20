import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from '../../../store/spots'
import * as reviewActions from "../../../store/reviews";
import ReservationForm from "./ReservationForm";
import "./OneSpot.css"
import Reviews from "./Reviews";
import WriteReviewForm from "./Reviews/WriteReviewForm";





function OneSpot () {

    function getAverageRating(reviews) {
        if (reviews.length === 0) {
            return 0;
        }

        const total = reviews.reduce((accumulator, review) => accumulator + review.stars, 0);
        const average = total / reviews.length;

        return average.toFixed(2);
    }



    const dispatch = useDispatch()
    const { id } = useParams()
    const user = useSelector(state => state.session.user)

    const [ showForm, setShowForm ] = useState(false)

    const formClick = () => {
        if(showForm) setShowForm(false)
        else setShowForm(true)
    }



    useEffect(() => {
        dispatch(spotActions.getSpotById(id))
        dispatch(reviewActions.spotReviews(id))
    }, [id, dispatch])



const spot = useSelector(state => state.spots.singleSpot)
const reviews = Object.values(useSelector(state => state.reviews.spot))

if(!spot.Owner) return null
return ( <div className="wrapper-for-info">
<div className="header">
    <h2 className="text spot-header">
        {spot.name}
    </h2>
    <div className="sub-info">
        <div className='ratings'>
        <span style={{"fontWeight":"normal"}}>
    <i className="fa-sharp fa-solid fa-star" style={{"color": "yellow"}}></i>
    {getAverageRating(reviews) === 0 ? 'New' : getAverageRating(reviews) }
    {console.log(spot.avgStarRating)}
  </span>
  <div className="after-reviews">
  <span>{spot.numReviews} · </span>
  <span>{spot.city}, {spot.state}, {spot.country}</span>
  </div>

        </div>
    </div>
</div>
<div className="image-container">
                {spot.SpotImages?.map((image, i) => (
                    (i === 0 ?
                    <div key={i} className="first-spot-image-container"><img className="first-spot-image" src={image.url} alt={i}/></div>
                    : <img key={i} className="spot-image" src={image.url} alt={i}/>)
                ))}
</div>
<div className="details">
<div className="host">
                    <h3>This home hosted by {spot.Owner.firstName}</h3>
                    <div><i className="fa-light fa-id-badge" style={{"color": "green"}}></i></div>
    </div>

</div>
<div className="Reviews">
    <h2>{reviews.length === 0 ? (
  <h2>Be the first to leave a review!</h2>
) : (
  <h2>{reviews.length === 1 ? '1 Review' : `${reviews.length} Reviews`} - Average Rating: {getAverageRating(reviews)}</h2>
)}</h2>
    {showForm ? (
        <WriteReviewForm hideForm={() => setShowForm(false)} />
    ) : (
        user && user.id !== spot.ownerId && <button onClick={formClick}>Create a review</button>
    )}
    {reviews.length ? (
        <Reviews reviews={reviews} />
    ) : (
        <div>No Reviews</div>
    )}
</div>
<br>
</br>


</div>

)
}

export default OneSpot
