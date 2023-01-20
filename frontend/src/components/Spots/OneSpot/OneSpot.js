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
    const dispatch = useDispatch()
    const { id } = useParams()

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

if(!spot) return null
return ( <div className="wrapper-for-info">
<div className="header">
    <h2 className="text spot-header">
        {spot.name}
    </h2>
    <div className="sub-info">
        <div className='ratings'>
            <span><i className="fa-sharp fa-solid fa-star"></i>{spot.avgStarRating}</span>
            <li>{spot.numReviews} reviews</li>
            <li>{spot.city}, {spot.state}, {spot.country}</li>
            <span><i className="fa-sharp fa-solid fa-star"></i>{spot.avgStarRating} ·</span>
            <span>{spot.numReviews} reviews · </span>
            <span>{spot.city}, {spot.state}, {spot.country}</span>
        </div>
        <div className="share">
            <span><i className="fa-solid fa-arrow-up-from-bracket"></i> Share</span>
            <span><i className="fa-regular fa-heart"></i> Save</span>
        </div>
    </div>
</div>
<div>WHERE PICTURES GO</div>
<div className="details">
<div className="host">
                    <h3>This home hosted by </h3>
                    <div>profile pic</div>
    </div>
    <div className="reserve-form"><ReservationForm {...spot} /></div>
</div>
<div>
{showForm ? (
                    <WriteReviewForm hideForm={() => setShowForm(false)}/>
                ) : (
                    <button onClick={formClick}>Create a review</button>
                )}
                     {reviews.length ? (
                    <Reviews reviews={reviews}/>
                ) : (<div>No Reviews</div>)}
            </div>
</div>
)
}

export default OneSpot
